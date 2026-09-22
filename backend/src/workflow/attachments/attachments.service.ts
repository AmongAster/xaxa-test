import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '../models/attachment.model';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectModel(Attachment)
    private attachmentModel: typeof Attachment,
  ) {}

  async uploadFile(instanceId: number, file: Express.Multer.File): Promise<Attachment> {
    return this.attachmentModel.create({
      instanceId,
      filename: file.originalname,
      path: file.path,
    });
  }

  async getByInstance(instanceId: number): Promise<Attachment[]> {
    return this.attachmentModel.findAll({ where: { instanceId } });
  }
}