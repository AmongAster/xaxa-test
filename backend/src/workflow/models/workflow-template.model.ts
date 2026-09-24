import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';

export const DEFAULT_WORKFLOW_STEPS: string[] = [
  'Первичный контакт с ВУЗом',
  'Согласование условий',
  'Подготовка договора',
  'Подписание договора',
  'Передача методических материалов',
  'Настройка ПО',
  'Обучение преподавателей',
  'Тестовый запуск',
  'Обратная связь по тестовому запуску',
  'Устранение замечаний',
  'Полноценный запуск курса',
  'Мониторинг первого потока',
  'Сбор отчётности по потоку',
  'Закрытие этапа/продление',
]; // 14 шагов по умолчанию — см. п.2.3 ТЗ; при желании меняются на конкретный шаблон

@Table({ tableName: 'workflow_templates', timestamps: true })
export class WorkflowTemplate extends Model<WorkflowTemplate> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: DEFAULT_WORKFLOW_STEPS })
  stepsConfig!: string[];

  @HasMany(() => WorkflowInstance)
  instances!: WorkflowInstance[];
}