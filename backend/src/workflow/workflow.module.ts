import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowTemplate } from './models/workflow-template.model';
import { WorkflowInstance } from './models/workflow-instance.model';
import { WorkflowStepHistory } from './models/workflow-step-history.model';
import { Attachment } from './models/attachment.model';
import { AttachmentsController } from './attachments/attachments.controller';
import { AttachmentsService } from './attachments/attachments.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      WorkflowTemplate,
      WorkflowInstance,
      WorkflowStepHistory,
      Attachment,
    ]),
  ],
  controllers: [WorkflowController, AttachmentsController],
  providers: [WorkflowService, AttachmentsService],
  exports: [WorkflowService],
})
export class WorkflowModule {}