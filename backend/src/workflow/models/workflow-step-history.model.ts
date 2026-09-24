import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';
import { Attachment } from './attachment.model';

@Table({ tableName: 'workflow_step_histories', timestamps: true })
export class WorkflowStepHistory extends Model<WorkflowStepHistory> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowInstance)
  @Column({ type: DataType.INTEGER, allowNull: false })
  instanceId!: number;

  @BelongsTo(() => WorkflowInstance)
  instance!: WorkflowInstance;

  @Column({ type: DataType.STRING, allowNull: false })
  stepName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  status!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  comment?: string;

  @HasMany(() => Attachment)
  attachments!: Attachment[];
}