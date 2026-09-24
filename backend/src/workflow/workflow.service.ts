import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Attachment } from './models/attachment.model';
import { University } from '../catalogs/models/university.model';
import { CreateWorkflowInstanceDto, TransitionWorkflowDto } from './dto/workflow.dto';
import { UsersService } from '../users/users.service';
import { WorkflowInstance, WorkflowInstanceStatus } from './models/workflow-instance.model';
import { WorkflowTemplate } from './models/workflow-template.model';
import { WorkflowStepHistory } from './models/workflow-step-history.model';
import { MinioService } from 'src/common/minio/minio.service';
import { RoleName } from 'src/roles/role.model';
import { User } from 'src/users/users.model';
 

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(WorkflowInstance) private readonly instanceModel: typeof WorkflowInstance,
    @InjectModel(WorkflowTemplate) private readonly templateModel: typeof WorkflowTemplate,
    @InjectModel(WorkflowStepHistory) private readonly stepHistoryModel: typeof WorkflowStepHistory,
    @InjectModel(Attachment) private readonly attachmentModel: typeof Attachment,
    private readonly usersService: UsersService,
    private readonly minioService: MinioService,
    private readonly sequelize: Sequelize,
  ) {}

   
  async createInstance(dto: CreateWorkflowInstanceDto, currentUser: User): Promise<WorkflowInstance> {
    if (currentUser.role?.name !== RoleName.ADMIN && currentUser.role?.name !== RoleName.MANAGER) {
      throw new ForbiddenException('Только администраторы и менеджеры могут запускать новые процессы внедрения');
    }

    return this.instanceModel.create({
      templateId: dto.templateId,
      universityId: dto.universityId,
      productId: dto.productId,
      currentStepIndex: 0,
      status: WorkflowInstanceStatus.ACTIVE,
    } as any);
  }

 
  async findOne(id: number, currentUser: User): Promise<WorkflowInstance> {
    const instance = await this.instanceModel.findByPk(id, {
      include: [University, WorkflowTemplate],
    });

    if (!instance) {
      throw new NotFoundException(`Процесс #${id} не найден`);
    }

    await this.assertVisible(instance, currentUser);
    return instance;
  }

  async transition(
    id: number,
    dto: TransitionWorkflowDto,
    currentUser: User,
  ): Promise<WorkflowInstance> {
    const instance = await this.findOne(id, currentUser);
    const template = instance.template;

    if (!template) {
      throw new NotFoundException('Шаблон процесса не найден');
    }

    const totalSteps = template.stepsConfig.length;

    if (dto.targetStepIndex < 0 || dto.targetStepIndex >= totalSteps) {
      throw new BadRequestException(`Индекс шага должен быть в диапазоне от 0 до ${totalSteps - 1}`);
    }

    const stepDelta = Math.abs(dto.targetStepIndex - instance.currentStepIndex);
    const isAdmin = currentUser.role?.name === RoleName.ADMIN;

    if (stepDelta > 1 && !isAdmin) {
      throw new ForbiddenException('Нельзя перепрыгивать через несколько шагов без прав администратора');
    }

    const targetStepName = template.stepsConfig[dto.targetStepIndex];
    const isCompleted = dto.targetStepIndex === totalSteps - 1;
    const newStatus = isCompleted ? WorkflowInstanceStatus.COMPLETED : WorkflowInstanceStatus.ACTIVE;

    return await this.sequelize.transaction(async (transaction: Transaction) => {
      await this.stepHistoryModel.create(
        {
          instanceId: instance.id,
          stepName: targetStepName,
          status: newStatus,
          comment: dto.comment,
        }as any,
        { transaction },
      );

      await instance.update(
        {
          currentStepIndex: dto.targetStepIndex,
          status: newStatus,
        },
        { transaction },
      );

      return instance;
    });
  }

  async uploadAttachment(
    instanceId: number,
    file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    currentUser: User,
  ): Promise<Attachment> {
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/zip',
      'application/x-gzip',
      'application/x-rar-compressed',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Недопустимый тип файла: ${file.mimetype}`);
    }

    
    const instance = await this.findOne(instanceId, currentUser);

    // Загружаем файл через существующий MinioService (возвращает "bucket/object-name")
    const storagePath = await this.minioService.upload(
      file.originalname, 
      file.buffer, 
      file.mimetype
    );

   
    return this.attachmentModel.create({
      instanceId: instance.id,
      filename: file.originalname,
      path: storagePath,
    });
  }

  
  async getAttachmentDownloadUrl(attachmentId: number, currentUser: User): Promise<string> {
    const attachment = await this.attachmentModel.findByPk(attachmentId, {
      include: [{ model: WorkflowInstance, include: [University] }],
    });

    if (!attachment) {
      throw new NotFoundException('Вложение не найдено');
    }

     
    await this.assertVisible(attachment.instance, currentUser);

     
    return this.minioService.getPresignedUrl(attachment.path, 3600);
  }

  //Проверка видимости (RBAC) через связанный университет/
  private async assertVisible(instance: WorkflowInstance, currentUser: User): Promise<void> {
    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);

    if (visibleManagerIds !== null && instance.university) {
      if (!visibleManagerIds.includes(instance.university.managerId)) {
        throw new ForbiddenException('Нет доступа к этому процессу');
      }
    }
  }
}