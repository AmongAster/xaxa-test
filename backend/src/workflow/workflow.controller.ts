import { Controller, Get, Post, Patch,  Body, Param, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowInstanceDto, TransitionWorkflowDto } from './dto/workflow.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/users/users.model';
 

// Рекомендуется использовать стандартный AuthGuard и декоратор текущего пользователя:
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('workflow')
@UseGuards(JwtAuthGuard) // Защита всех эндпоинтов модуля JWT-токеном
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Запуск нового процесса внедрения продукта в ВУЗе
   * POST /workflow/instances
   */
  @Post('instances')
  async createInstance(
    @Body() dto: CreateWorkflowInstanceDto,
    // @CurrentUser() currentUser: User,
  ) {
    const currentUser = {} as User; // Замените на ваш реальный декоратор @CurrentUser()
    return this.workflowService.createInstance(dto, currentUser);
  }

  /**
   * Получение информации о процессе по ID с проверкой прав доступа
   * GET /workflow/instances/:id
   */
  @Get('instances/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    // @CurrentUser() currentUser: User,
  ) {
    const currentUser = {} as User;
    return this.workflowService.findOne(id, currentUser);
  }

  /**
   * Переход процесса на другой шаг (смена этапа)
   * PATCH /workflow/instances/:id/transition
   */
  @Patch('instances/:id/transition')
  async transition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TransitionWorkflowDto,
    // @CurrentUser() currentUser: User,
  ) {
    const currentUser = {} as User;
    return this.workflowService.transition(id, dto, currentUser);
  }

  /**
   * Загрузка файла (вложения) к процессу в MinIO
   * POST /workflow/instances/:id/attachments
   */
  @Post('instances/:id/attachments')
  @UseInterceptors(FileInterceptor('file')) // Перехват файла из мультипарт-запроса (поле "file")
  async uploadAttachment(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    // @CurrentUser() currentUser: User,
  ) {
    const currentUser = {} as User;
    return this.workflowService.uploadAttachment(id, file, currentUser);
  }

  /**
   * Получение временной безопасной ссылки (presigned URL) для скачивания файла
   * GET /workflow/attachments/:id/download-url
   */
  @Get('attachments/:id/download-url')
  async getAttachmentDownloadUrl(
    @Param('id', ParseIntPipe) id: number,
    // @CurrentUser() currentUser: User,
  ) {
    const currentUser = {} as User;
    const downloadUrl = await this.workflowService.getAttachmentDownloadUrl(id, currentUser);
    return { downloadUrl };
  }
}