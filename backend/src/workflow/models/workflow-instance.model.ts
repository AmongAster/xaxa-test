import {BelongsTo,Column,DataType,ForeignKey,HasMany,Model,Table,} from 'sequelize-typescript';
import { University } from '../../catalogs/models/university.model';
import { ITProduct } from '../../catalogs/models/it-product.model';
import { WorkflowTemplate } from './workflow-template.model';
import { WorkflowStepHistory } from './workflow-step-history.model';

export enum WorkflowInstanceStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

interface WorkflowInstanceAttributes {
  id: number;
  templateId: number;
  universityId: number;
  productId: number;
  currentStepIndex: number;
  status: WorkflowInstanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowInstanceCreationAttributes
  extends Omit<
    WorkflowInstanceAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'currentStepIndex'
    | 'status'
  > {
  currentStepIndex?: number;
  status?: WorkflowInstanceStatus;
}

@Table({
  tableName: 'workflow_instances',
  timestamps: true,
})
export class WorkflowInstance extends Model<
  WorkflowInstanceAttributes,
  WorkflowInstanceCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => WorkflowTemplate)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare templateId: number;

  @BelongsTo(() => WorkflowTemplate)
  declare template?: WorkflowTemplate;

  @ForeignKey(() => University)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare universityId: number;

  @BelongsTo(() => University)
  declare university: University;

  @ForeignKey(() => ITProduct)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @BelongsTo(() => ITProduct)
  declare product?: ITProduct;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare currentStepIndex: number;

  @Column({
    type: DataType.ENUM(...Object.values(WorkflowInstanceStatus)),
    allowNull: false,
    defaultValue: WorkflowInstanceStatus.ACTIVE,
  })
  declare status: WorkflowInstanceStatus;

  @HasMany(() => WorkflowStepHistory)
  declare history?: WorkflowStepHistory[];

  declare createdAt: Date;
  declare updatedAt: Date;
}