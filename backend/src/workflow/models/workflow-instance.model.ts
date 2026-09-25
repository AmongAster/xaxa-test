import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { WorkflowTemplate } from './workflow-template.model';
import { WorkflowStepHistory } from './workflow-step-history.model';
import { Attachment } from './attachment.model';

// 1. Интерфейс, описывающий поля при создании (id и status необязательны, так как есть default)
interface WorkflowInstanceCreationAttrs {
  templateId: number;
  status?: string;
  currentStep?: string | null;
}

@Table({ tableName: 'workflow_instances' })
export class WorkflowInstance extends Model<WorkflowInstance, WorkflowInstanceCreationAttrs> { // <-- Передали интерфейс создания
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowTemplate)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare templateId: number;

  @BelongsTo(() => WorkflowTemplate)
  declare template: WorkflowTemplate;

  @Column({ type: DataType.STRING, defaultValue: 'PENDING' })
  declare status: string;

  // ИСПРАВЛЕНО: Заменили ? на declare с поддержкой null, чтобы Sequelize корректно работал с TypeScript
  @Column({ type: DataType.STRING, allowNull: true })
  declare currentStep: string | null; 

  @HasMany(() => WorkflowStepHistory)
  declare history: WorkflowStepHistory[];

  @HasMany(() => Attachment)
  declare attachments: Attachment[];
}
