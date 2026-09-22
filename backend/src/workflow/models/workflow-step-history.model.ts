import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';

@Table({ tableName: 'workflow_step_histories' })
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
  comment?: string; // Комментарий необязателен
}