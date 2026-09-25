import 'multer';
import { Controller, Post, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';

@Controller('workflow/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post(':instanceId')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('instanceId') instanceId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentsService.uploadFile(Number(instanceId), file);
  }

  @Get(':instanceId')
  getByInstance(@Param('instanceId') instanceId: number) {
    return this.attachmentsService.getByInstance(Number(instanceId));
  }
}