import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';

// Интерфейс, описывающий поля, необходимые при создании записи истории
interface WorkflowStepHistoryCreationAttrs {
  instanceId: number;
  stepName: string;
  status: string;
  comment?: string | null;
}

@Table({ tableName: 'workflow_step_histories' })
export class WorkflowStepHistory extends Model<WorkflowStepHistory, WorkflowStepHistoryCreationAttrs> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowInstance)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare instanceId: number; // ИСПРАВЛЕНО: declare вместо !

  @BelongsTo(() => WorkflowInstance)
  declare instance: WorkflowInstance; // ИСПРАВЛЕНО: declare вместо !

  @Column({ type: DataType.STRING, allowNull: false })
  declare stepName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare status: string; // ИСПРАВЛЕНО: declare вместо !

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string | null; // ИСПРАВЛЕНО: declare вместо ?
}
