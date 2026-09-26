import { Controller, Get, Post, Param, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/users.model';

@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
constructor(private readonly attachmentsService: AttachmentsService) {}

  /**
   * Загрузка файла (вложения) к текущему этапу процесса
   * POST /workflow/instances/:id/attachments
   */
  @Post('instances/:id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
  @Param('id', ParseIntPipe) instanceId: number,
  @UploadedFile() file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
  @CurrentUser() currentUser: User,
  ) {
    // Заглушка удалена, используем реального пользователя из декоратора
  return this.attachmentsService.uploadFile(instanceId, file, currentUser);
  }

  /**
   * Получение временной подписанной ссылки для скачивания файла
   * GET /workflow/attachments/:id/download-url
   */
  @Get('attachments/:id/download-url')
  async getDownloadUrl(
  @Param('id', ParseIntPipe) attachmentId: number,
  @CurrentUser() currentUser: User,
  ) {
   
  const downloadUrl = await this.attachmentsService.getDownloadUrl(attachmentId, currentUser);
  return { downloadUrl };
  }
}