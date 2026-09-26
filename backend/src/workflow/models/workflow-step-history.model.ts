import {BelongsTo,Column,DataType,ForeignKey,HasMany,Model,Table,} from 'sequelize-typescript';
import { User } from '../../users/users.model';
import { Attachment } from './attachment.model';
import { WorkflowInstance } from './workflow-instance.model';

interface WorkflowStepHistoryAttributes {
  id: number;
  instanceId: number;
  fromStepIndex: number | null;
  fromStepName: string | null;
  toStepIndex: number;
  stepName: string;
  userId: number;
  comment: string | null;
  changedAt: Date;
  createdAt: Date;
}

interface WorkflowStepHistoryCreationAttributes
  extends Omit<
    WorkflowStepHistoryAttributes,
    'id' | 'createdAt'
  > {}

@Table({
  tableName: 'workflow_step_history',
  timestamps: true,
  updatedAt: false,
})
export class WorkflowStepHistory extends Model<
  WorkflowStepHistoryAttributes,
  WorkflowStepHistoryCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => WorkflowInstance)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare instanceId: number;

  @BelongsTo(() => WorkflowInstance)
  declare instance?: WorkflowInstance;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare fromStepIndex: number | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare fromStepName: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare toStepIndex: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare stepName: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comment: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare changedAt: Date;

  @HasMany(() => Attachment)
  declare attachments?: Attachment[];

  declare createdAt: Date;
}