import {BelongsTo,Column,DataType,ForeignKey,HasMany,Model,Table,} from 'sequelize-typescript';
import { WorkflowTemplate } from './workflow-template.model';
import { WorkflowStepHistory } from './workflow-step-history.model';
import { University } from '../../catalogs/models/university.model';
import { ITProduct } from '../../catalogs/models/it-product.model';

export enum WorkflowInstanceStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

@Table({ tableName: 'workflow_instances', timestamps: true })
export class WorkflowInstance extends Model<WorkflowInstance> {
  @ForeignKey(() => WorkflowTemplate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare templateId: number;

  @BelongsTo(() => WorkflowTemplate)
  template!: WorkflowTemplate;

  @ForeignKey(() => University)
  @Column({ type: DataType.INTEGER, allowNull: false })
  universityId!: number;

  @BelongsTo(() => University)
  university!: University;

  @ForeignKey(() => ITProduct)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId!: number;

  @BelongsTo(() => ITProduct)
  product!: ITProduct;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  currentStepIndex!: number;

  @Column({
    type: DataType.ENUM(...Object.values(WorkflowInstanceStatus)),
    allowNull: false,
    defaultValue: WorkflowInstanceStatus.ACTIVE,
  })
  status!: WorkflowInstanceStatus;

  @HasMany(() => WorkflowStepHistory)
  history!: WorkflowStepHistory[];
}