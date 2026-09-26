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
import { UsersModule } from 'src/users/users.module';
import { MinioModule } from 'src/common/minio/minio.module';
import { UsersService } from 'src/users/users.service';
import { MinioService } from 'src/common/minio/minio.service';

@Module({
  imports: [
    UsersModule,
    MinioModule,
    SequelizeModule.forFeature([
      WorkflowTemplate,
      WorkflowInstance,
      WorkflowStepHistory,
      Attachment,
    ]),
  ],
  controllers: [WorkflowController, AttachmentsController],
  providers: [WorkflowService, AttachmentsService, UsersService, MinioService],
  exports: [WorkflowService],
})
export class WorkflowModule {}