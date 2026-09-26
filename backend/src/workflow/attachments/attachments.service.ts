import { 
  BadRequestException, 
  ForbiddenException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '../models/attachment.model';
import { WorkflowInstance } from '../models/workflow-instance.model';
import { WorkflowStepHistory } from '../models/workflow-step-history.model';
import { MinioService } from 'src/common/minio/minio.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { University } from 'src/catalogs/models/university.model';
 
@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment) private readonly attachmentModel: typeof Attachment,
    @InjectModel(WorkflowInstance) private readonly instanceModel: typeof WorkflowInstance,
    @InjectModel(WorkflowStepHistory) private readonly stepHistoryModel: typeof WorkflowStepHistory,
    private readonly minioService: MinioService,
    private readonly usersService: UsersService,
  ) {}

  async uploadFile(
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

    const instance = await this.instanceModel.findByPk(instanceId, {
      include: [University],
    });

    if (!instance) {
      throw new NotFoundException(`Процесс #${instanceId} не найден`);
    }

    await this.assertVisible(instance, currentUser);

    const latestHistory = await this.stepHistoryModel.findOne({
      where: { instanceId: instance.id },
      order: [['createdAt', 'DESC']],
    });

    if (!latestHistory) {
      throw new NotFoundException('У процесса ещё нет истории шагов. Нельзя прикрепить файл до первого перехода.');
    }

    const storagePath = await this.minioService.upload(
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    const payload = {
      stepHistoryId: latestHistory.id,
      filename: file.originalname,
      path: storagePath,
      mimeType: file.mimetype,
      size: file.size,
    };

    return this.attachmentModel.create(payload as any);
  }

  async getDownloadUrl(attachmentId: number, currentUser: User): Promise<string> {
    const attachment = await this.attachmentModel.findByPk(attachmentId, {
      include: [
        {
          model: WorkflowStepHistory,
          include: [
            {
              model: WorkflowInstance,
              include: [University],
            },
          ],
        },
      ],
    });

    if (!attachment) {
      throw new NotFoundException('Вложение не найдено');
    }

    const instance = attachment.stepHistory?.instance;
    if (!instance) {
      throw new NotFoundException('Связанный рабочий процесс не найден');
    }

    await this.assertVisible(instance, currentUser);

    return this.minioService.getPresignedUrl(attachment.path, 3600);
  }

  private async assertVisible(instance: WorkflowInstance, currentUser: User): Promise<void> {
    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);

    if (visibleManagerIds !== null && instance.university) {
      if (!visibleManagerIds.includes(instance.university.managerId)) {
        throw new ForbiddenException('Нет доступа к этому процессу');
      }
    }
  }
}