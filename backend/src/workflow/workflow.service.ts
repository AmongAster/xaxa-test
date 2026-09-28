import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { University } from '../catalogs/models/university.model';
import { ITProduct } from '../catalogs/models/it-product.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { RoleName } from '../roles/role.model';
import {CreateWorkflowInstanceDto,TransitionWorkflowDto,} from './dto/workflow.dto';
import {WorkflowInstance,WorkflowInstanceStatus} from './models/workflow-instance.model';
import { WorkflowTemplate } from './models/workflow-template.model';
import { WorkflowStepHistory } from './models/workflow-step-history.model';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(WorkflowInstance)
    private readonly instanceModel: typeof WorkflowInstance,

    @InjectModel(WorkflowTemplate)
    private readonly templateModel: typeof WorkflowTemplate,

    @InjectModel(WorkflowStepHistory)
    private readonly historyModel: typeof WorkflowStepHistory,

    @InjectModel(ITProduct)
    private readonly productModel: typeof ITProduct,

    @InjectModel(University)
    private readonly universityModel: typeof University,

    private readonly usersService: UsersService,
    private readonly sequelize: Sequelize,
  ) {}

  async createInstance(
    dto: CreateWorkflowInstanceDto,
    currentUser: User,
  ): Promise<WorkflowInstance> {
    this.assertCanCreate(currentUser);

    const template = await this.templateModel.findByPk(dto.templateId);

    if (!template) {
      throw new NotFoundException(
        `Шаблон процесса #${dto.templateId} не найден`,
      );
    }

    const steps = this.getSteps(template);

    const university = await this.universityModel.findByPk(
      dto.universityId,
    );

    if (!university) {
      throw new NotFoundException(
        `ВУЗ #${dto.universityId} не найден`,
      );
    }

    await this.assertVisibleUniversity(
      university,
      currentUser,
    );

    const product = await this.productModel.findByPk(
      dto.productId,
    );

    if (!product) {
      throw new NotFoundException(
        `IT-продукт #${dto.productId} не найден`,
      );
    }

    if (product.universityId !== university.id) {
      throw new BadRequestException(
        'IT-продукт не принадлежит указанному ВУЗу',
      );
    }

    const initialStatus =
      steps.length === 1
        ? WorkflowInstanceStatus.COMPLETED
        : WorkflowInstanceStatus.ACTIVE;

    return this.sequelize.transaction(
      async (transaction: Transaction) => {
        const instance = await this.instanceModel.create(
          {
            templateId: template.id,
            universityId: university.id,
            productId: product.id,
            currentStepIndex: 0,
            status: initialStatus,
          },
          { transaction },
        );

        await this.historyModel.create(
          {
instanceId: instance.id,
fromStepIndex: null,
fromStepName: null,

toStepIndex: 0,
stepName: steps[0],

userId: currentUser.id,
comment: null,
changedAt: new Date(),
    },
          { transaction },
        );

        return instance;
      },
    );
  }

  async findOne(
    id: number,
    currentUser: User,
  ): Promise<WorkflowInstance> {
    const instance = await this.instanceModel.findByPk(id, {
      include: [
        University,
        WorkflowTemplate,
        {
          model: WorkflowStepHistory,
          include: [User],
        },
      ],
      order: [
        [
          WorkflowStepHistory,
          'changedAt',
          'ASC',
        ],
      ],
    });

    if (!instance) {
      throw new NotFoundException(
        `Процесс #${id} не найден`,
      );
    }

    await this.assertVisibleUniversity(
      instance.university,
      currentUser,
    );

    return instance;
  }

  async transition(
    id: number,
    dto: TransitionWorkflowDto,
    currentUser: User,
  ): Promise<WorkflowInstance> {
    return this.sequelize.transaction(
      async (transaction: Transaction) => {
        const instance = await this.instanceModel.findByPk(id, {
          include: [
            University,
            WorkflowTemplate,
          ],
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        if (!instance) {
          throw new NotFoundException(
            `Процесс #${id} не найден`,
          );
        }

        await this.assertVisibleUniversity(
          instance.university,
          currentUser,
        );

        if (!instance.template) {
          throw new NotFoundException(
            'Шаблон процесса не найден',
          );
        }

        if (instance.status === WorkflowInstanceStatus.COMPLETED) {
          throw new BadRequestException(
            'Завершённый процесс нельзя изменить',
          );
        }

        if (instance.status === WorkflowInstanceStatus.PAUSED) {
          throw new BadRequestException(
            'Приостановленный процесс нельзя изменить',
          );
        }

        const steps = this.getSteps(instance.template);

        this.validateTargetStep(
          dto.targetStepIndex,
          steps.length,
        );

        this.assertTransitionAllowed(
          instance.currentStepIndex,
          dto.targetStepIndex,
          currentUser,
        );

        const fromStepIndex =
          instance.currentStepIndex;

        const fromStepName =
          steps[fromStepIndex];

        const toStepIndex =
          dto.targetStepIndex;

        const toStepName =
          steps[toStepIndex];

        const newStatus =
          toStepIndex === steps.length - 1
            ? WorkflowInstanceStatus.COMPLETED
            : WorkflowInstanceStatus.ACTIVE;

        instance.currentStepIndex = toStepIndex;
        instance.status = newStatus;

        await instance.save({ transaction });

        await this.historyModel.create(
          {
            instanceId: instance.id,

            fromStepIndex,
            fromStepName,

            toStepIndex,
            stepName: toStepName,

            userId: currentUser.id,
            comment: dto.comment ?? null,

            changedAt: new Date(),
          },
          { transaction },
        );

        return instance;
      },
    );
  }

  private assertCanCreate(
    currentUser: User,
  ): void {
    const role = currentUser.role?.name;

    if (
      role !== RoleName.ADMIN &&
      role !== RoleName.MANAGER
    ) {
      throw new ForbiddenException(
        'Только ADMIN и MANAGER могут создавать процессы',
      );
    }
  }

  private async assertVisibleUniversity(
    university: University,
    currentUser: User,
  ): Promise<void> {
    if (!university) {
      throw new NotFoundException(
        'Связанный ВУЗ не найден',
      );
    }

    const visibleManagerIds =
      await this.usersService.getVisibleManagerIds(
        currentUser,
      );

    if (
      visibleManagerIds !== null &&
      !visibleManagerIds.includes(
        university.managerId,
      )
    ) {
      throw new ForbiddenException(
        'Нет доступа к этому процессу',
      );
    }
  }
  
  private assertTransitionAllowed(
    currentStepIndex: number,
    targetStepIndex: number,
    currentUser: User,
  ): void {
    if (targetStepIndex === currentStepIndex) {
      throw new BadRequestException(
        'Процесс уже находится на этом этапе',
      );
    }

    if (targetStepIndex < currentStepIndex) {
      throw new BadRequestException(
        'Возврат на предыдущий этап не поддерживается',
      );
    }

    if (
      currentUser.role?.name === RoleName.ADMIN
    ) {
      return;
    }

    if (
      targetStepIndex !== currentStepIndex + 1
    ) {
      throw new ForbiddenException(
        'USER и MANAGER могут переходить только на следующий этап',
      );
    }
  }

  private validateTargetStep(
    targetStepIndex: number,
    totalSteps: number,
  ): void {
    if (
      !Number.isInteger(targetStepIndex) ||
      targetStepIndex < 0 ||
      targetStepIndex >= totalSteps
    ) {
      throw new BadRequestException(
        `Индекс этапа должен быть от 0 до ${
          totalSteps - 1
        }`,
      );
    }
  }

  private getSteps(
    template: WorkflowTemplate,
  ): string[] {
    if (!Array.isArray(template.stepsConfig)) {
      throw new BadRequestException(
        'Некорректная конфигурация этапов workflow',
      );
    }

    const steps = template.stepsConfig
      .map((step) =>
        typeof step === 'string'
          ? step.trim()
          : '',
      )
      .filter(Boolean);

    if (steps.length === 0) {
      throw new BadRequestException(
        'У шаблона нет этапов workflow',
      );
    }

    return steps;
  }
}