import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { University } from '../models/university.model';
import { UsersService } from 'src/users/users.service';
import { FilterUniversityDto } from '../dto/filter-university.dto';
import { CreateUniversityDto } from '../dto/create-university.dto';
import { UpdateUniversityDto } from '../dto/update-university.dto';
import { rethrowAsHttpException } from 'src/common/utils/Sequelize error.util';
import { User } from 'src/users/users.model';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University)
    private readonly universityModel: typeof University,
    private readonly usersService: UsersService,
  ) {}

  async findAll(currentUser: User, filter: FilterUniversityDto) {
    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);
    const where = this.buildWhereConditions(filter, visibleManagerIds);

    const page = Math.max(1, filter.page ?? 1);
    const limit = Math.min(filter.limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

    const { rows, count } = await this.universityModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    return { items: rows, total: count, page, limit };
  }

  async findOne(id: number, currentUser: User): Promise<University> {
    const university = await this.universityModel.findByPk(id);
    if (!university) {
      throw new NotFoundException('ВУЗ не найден');
    }

    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);
    this.checkVisibility(university.managerId, visibleManagerIds);

    return university;
  }

  async create(dto: CreateUniversityDto): Promise<University> {
    try {
      return await this.universityModel.create(dto as any);
    } catch (error) {
      rethrowAsHttpException(error);
    }
  }

  async update(id: number, dto: UpdateUniversityDto, currentUser: User): Promise<University> {
    const university = await this.findOne(id, currentUser);
    try {
      return await university.update(dto);
    } catch (error) {
      rethrowAsHttpException(error);
    }
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const university = await this.findOne(id, currentUser);
    try {
      await university.destroy();
    } catch (error) {
      rethrowAsHttpException(error);
    }
  }

  
  private buildWhereConditions(
    filter: FilterUniversityDto,
    visibleManagerIds: number[] | null,
  ): WhereOptions<University> {
    const where: WhereOptions<University> = {};

    // 1. Фильтрация по правам доступа
    if (visibleManagerIds !== null) {
      if (filter.managerId && !visibleManagerIds.includes(filter.managerId)) {
        throw new ForbiddenException('Нет доступа к ВУЗам этого менеджера');
      }
      where.managerId = filter.managerId ? filter.managerId : { [Op.in]: visibleManagerIds };
    } else if (filter.managerId) {
      where.managerId = filter.managerId;
    }

    // 2. Дополнительные фильтры
    if (filter.transferStatus) {
      where.transferStatus = filter.transferStatus;
    }

    if (filter.search) {
      // Исправлено: добавлены обратные кавычки для шаблонной строки
      where.name = { [Op.iLike]: `%${filter.search.trim()}%` };
    }

    return where;
  }

  /**
   * Синхронная проверка видимости сущности для пользователя
   */
  private checkVisibility(managerId: number, getVisibleManagerIds: number[] | null): void {
    if (getVisibleManagerIds !== null && !getVisibleManagerIds.includes(managerId)) {
      throw new ForbiddenException('Нет доступа к этому ВУЗу');
    }
  }
}