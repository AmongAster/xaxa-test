import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowInstance } from '../models/workflow-instance.model';
import { WorkflowStepHistory } from '../models/workflow-step-history.model';
import { Attachment } from '../models/attachment.model';
import { University } from '../../catalogs/models/university.model';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/users.model';
import { RoleName } from '../../roles/role.model';
import { MinioService } from '../../common/minio/minio.service';

interface UploadedWorkflowFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class AttachmentsService {
  private readonly allowedMimeTypes = new Set([
    'image/png',
    'image/jpeg',
    'application/pdf',

    'application/zip',
    'application/gzip',
    'application/x-rar-compressed',

    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]);

 
  private readonly maxFileSize = 50 * 1024 * 1024;

  constructor(
    @InjectModel(Attachment)
    private readonly attachmentModel: typeof Attachment,

    @InjectModel(WorkflowStepHistory)
    private readonly stepHistoryModel: typeof WorkflowStepHistory,

    @InjectModel(WorkflowInstance)
    private readonly instanceModel: typeof WorkflowInstance,

    private readonly usersService: UsersService,

    private readonly minioService: MinioService,
  ) {}

  async uploadFile(
    instanceId: number,
    file: UploadedWorkflowFile,
    currentUser: User,
  ): Promise<Attachment> {
    if (!file) {
      throw new BadRequestException(
        'Файл не передан',
      );
    }

    if (file.size <= 0) {
      throw new BadRequestException(
        'Нельзя загрузить пустой файл',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `Размер файла не должен превышать ${this.maxFileSize / 1024 / 1024} MB`,
      );
    }

    if (
      !this.allowedMimeTypes.has(file.mimetype)
    ) {
      throw new BadRequestException(
        `Недопустимый тип файла: ${file.mimetype}`,
      );
    }

    const instance =
      await this.instanceModel.findByPk(
        instanceId,
        {
          include: [University],
        },
      );

    if (!instance) {
      throw new NotFoundException(
        `Процесс #${instanceId} не найден`,
      );
    }

    await this.assertVisible(
      instance,
      currentUser,
    );

    const latestHistory =
      await this.stepHistoryModel.findOne({
        where: {
          instanceId: instance.id,
        },
        order: [
          ['changedAt', 'DESC'],
        ],
      });

    if (!latestHistory) {
      throw new NotFoundException(
        'История текущего этапа не найдена',
      );
    }

    let storagePath: string | null = null;

    try {
      storagePath =
        await this.minioService.upload(
          file.originalname,
          file.buffer,
          file.mimetype,
        );

      return await this.attachmentModel.create({
        stepHistoryId: latestHistory.id,
        filename: file.originalname,
        path: storagePath,
        mimeType: file.mimetype,
        size: file.size,
      });
    } catch (error) {
     
      if (storagePath) {
        await this.minioService
          .remove(storagePath)
          .catch(() => undefined);
      }

      throw error;
    }
  }

  async getDownloadUrl(
    attachmentId: number,
    currentUser: User,
  ): Promise<string> {
    this.assertCanDownload(currentUser);

    const attachment =
      await this.attachmentModel.findByPk(
        attachmentId,
        {
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
        },
      );

    if (!attachment) {
      throw new NotFoundException(
        'Вложение не найдено',
      );
    }

    const instance =
      attachment.stepHistory?.instance;

    if (!instance) {
      throw new NotFoundException(
        'Связанный процесс не найден',
      );
    }

    await this.assertVisible(
      instance,
      currentUser,
    );

    return this.minioService.getPresignedUrl(
      attachment.path,
      3600,
    );
  }

  private assertCanDownload(
    currentUser: User,
  ): void {
    const role = currentUser.role?.name;

    if (
      role !== RoleName.ADMIN &&
      role !== RoleName.MANAGER
    ) {
      throw new ForbiddenException(
        'Скачивание документов доступно только менеджеру и администратору',
      );
    }
  }

  private async assertVisible(
    instance: WorkflowInstance,
    currentUser: User,
  ): Promise<void> {
    const visibleManagerIds =
      await this.usersService.getVisibleManagerIds(
        currentUser,
      );

    if (visibleManagerIds === null) {
      return;
    }

    if (!instance.university) {
      throw new ForbiddenException(
        'Нет доступа к этому процессу',
      );
    }

    if (
      !visibleManagerIds.includes(
        instance.university.managerId,
      )
    ) {
      throw new ForbiddenException(
        'Нет доступа к этому процессу',
      );
    }
  }
}