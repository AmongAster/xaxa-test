import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';

@Table({ tableName: 'workflow_templates' })
export class WorkflowTemplate extends Model<WorkflowTemplate> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string; // Необязательное поле

  @Column({ type: DataType.JSON, allowNull: false })
  steps!: { stepName: string; order: number }[];

  @HasMany(() => WorkflowInstance)
  instances!: WorkflowInstance[];
}