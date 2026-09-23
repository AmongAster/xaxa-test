import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTemplate } from './models/workflow-template.model';
import { WorkflowInstance } from './models/workflow-instance.model';
import { WorkflowStepHistory } from './models/workflow-step-history.model';
import { CreateWorkflowTemplateDto, StartWorkflowDto, UpdateStepDto } from './dto/workflow.dto';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(WorkflowTemplate)
    private templateModel: typeof WorkflowTemplate,
    @InjectModel(WorkflowInstance)
    private instanceModel: typeof WorkflowInstance,
    @InjectModel(WorkflowStepHistory)
    private historyModel: typeof WorkflowStepHistory,
  ) {}

  async createTemplate(dto: CreateWorkflowTemplateDto) {
    return this.templateModel.create(dto as any);
  }

  async startWorkflow(dto: StartWorkflowDto) {
    const template = await this.templateModel.findByPk(dto.templateId);
    if (!template) throw new NotFoundException('Template not found');

    const firstStep = template.steps.sort((a, b) => a.order - b.order)[0]?.stepName;

    return this.instanceModel.create({
      templateId: dto.templateId,
      status: 'IN_PROGRESS',
      currentStep: firstStep || 'Completed',
    });
  }

  async updateStep(instanceId: number, dto: UpdateStepDto) {
    const instance = await this.instanceModel.findByPk(instanceId, { include: [WorkflowTemplate] });
    if (!instance) throw new NotFoundException('Instance not found');

    // Записываем историю шага
    await this.historyModel.create({
      instanceId,
      stepName: instance.currentStep,
      status: dto.status,
      comment: dto.comment,
    });

    // Логика перехода к следующему шагу
    const steps = instance.template.steps.sort((a, b) => a.order - b.order);
    const currentIndex = steps.findIndex((s) => s.stepName === instance.currentStep);

    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      instance.currentStep = steps[currentIndex + 1].stepName;
    } else {
      instance.currentStep = 'Completed';
      instance.status = 'COMPLETED';
    }

    await instance.save();
    return instance;
  }
}