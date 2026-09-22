import { Controller, Post, Body, Param, Patch } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowTemplateDto, StartWorkflowDto, UpdateStepDto } from './dto/workflow.dto';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('templates')
  createTemplate(@Body() dto: CreateWorkflowTemplateDto) {
    return this.workflowService.createTemplate(dto);
  }

  @Post('instances')
  startWorkflow(@Body() dto: StartWorkflowDto) {
    return this.workflowService.startWorkflow(dto);
  }

  @Patch('instances/:id/step')
  updateStep(@Param('id') id: number, @Body() dto: UpdateStepDto) {
    return this.workflowService.updateStep(Number(id), dto);
  }
}