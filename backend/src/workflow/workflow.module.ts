import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from '../catalogs/models/university.model';
import { ITProduct } from '../catalogs/models/it-product.model';
import { UsersModule } from '../users/users.module';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowTemplate } from './models/workflow-template.model';
import { WorkflowInstance } from './models/workflow-instance.model';
import { WorkflowStepHistory } from './models/workflow-step-history.model';
import { Attachment } from './models/attachment.model';
import { AttachmentsController } from './attachments/attachments.controller';
import { AttachmentsService } from './attachments/attachments.service';
import { MinioModule } from '../common/minio/minio.module';

@Module({
  imports: [SequelizeModule.forFeature([
      WorkflowTemplate,
      WorkflowInstance,
      WorkflowStepHistory,
      Attachment,
      University,
      ITProduct,
    ]),
    UsersModule,
    MinioModule
  ],
  controllers: [WorkflowController,
    AttachmentsController,],

  providers: [
    WorkflowService,
    AttachmentsService,],
  exports: [WorkflowService,],
})
export class WorkflowModule {}