import {  Controller,  Get,  Post,  Patch,  Body,  Param,  ParseIntPipe,  UseGuards } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowInstanceDto, TransitionWorkflowDto } from './dto/workflow.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/users.model';

@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
constructor(private readonly workflowService: WorkflowService) {}

  /**
   * Запуск нового процесса внедрения продукта в ВУЗе
   * POST /workflow/instances
   */
  @Post('instances')
  async createInstance(
  @Body() dto: CreateWorkflowInstanceDto,
  @CurrentUser() currentUser: User,
  ) {
  return this.workflowService.createInstance(dto, currentUser);
  }

  /**
   * Получение информации о процессе по ID
   * GET /workflow/instances/:id
   */
  @Get('instances/:id')
  async findOne(
  @Param('id', ParseIntPipe) id: number,
  @CurrentUser() currentUser: User,
  ) {
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
  @CurrentUser() currentUser: User,
  ) {
  return this.workflowService.transition(id, dto, currentUser);
  }
}