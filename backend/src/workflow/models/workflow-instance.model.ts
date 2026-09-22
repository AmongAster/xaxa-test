import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { WorkflowTemplate } from './workflow-template.model';
import { WorkflowStepHistory } from './workflow-step-history.model';
import { Attachment } from './attachment.model';

@Table({ tableName: 'workflow_instances' })
export class WorkflowInstance extends Model<WorkflowInstance> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowTemplate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  templateId!: number;

  @BelongsTo(() => WorkflowTemplate)
  template!: WorkflowTemplate;

  @Column({ type: DataType.STRING, defaultValue: 'PENDING' })
  status!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  currentStep?: string; // Может отсутствовать

  @HasMany(() => WorkflowStepHistory)
  history!: WorkflowStepHistory[];

  @HasMany(() => Attachment)
  attachments!: Attachment[];
}