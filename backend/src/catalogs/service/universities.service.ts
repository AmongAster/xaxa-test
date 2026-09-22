<<<<<<< HEAD
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
=======
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

 
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8

import { CreateUniversityDto } from '../dto/create-university.dto';
import { UpdateUniversityDto } from '../dto/update-university.dto';
import { FilterUniversityDto } from '../dto/filter-university.dto';
import { rethrowAsHttpException } from 'src/common/utils/Sequelize error.util';
import { University } from '../models/university.model';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

// Лимиты для пагинации вынесены в конфигурационные константы
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University)
    private readonly universityModel: typeof University,
    private readonly usersService: UsersService,
  ) {}

<<<<<<< HEAD
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

=======
  /**
   * Получение списка ВУЗов с фильтрацией, проверкой прав доступа и пагинацией.
   */
  async findAll(currentUser: User, filter: FilterUniversityDto) {
    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);
    
    // Проверяем, имеет ли пользователь право фильтровать по конкретному менеджеру
    this.validateFilterAccess(filter.managerId, visibleManagerIds);

    // Сборка условий фильтрации для базы данных
    const where = this.buildWhereClause(filter, visibleManagerIds);

    // Расчет параметров пагинации (Исправлено: DEFAULT_SIZE заменено на DEFAULT_PAGE_SIZE)
    const page = filter.page ?? DEFAULT_PAGE;
    const limit = Math.min(filter.limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await this.universityModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { items, total, page, limit };
  }

  /**
   * Получение одного ВУЗа по ID с проверкой прав доступа.
   */
  async findOne(id: number, currentUser: User): Promise<University> {
    const university = await this.universityModel.findByPk(id);
    if (!university) {
      throw new NotFoundException(`ВУЗ #${id} не найден`);
    }

    await this.assertVisible(university, currentUser);
    return university;
  }

  /**
   * Создание нового ВУЗа с безопасной обработкой ошибок БД.
   */
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
  async create(dto: CreateUniversityDto): Promise<University> {
    try {
      return await this.universityModel.create(dto as any);
    } catch (error) {
<<<<<<< HEAD
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
=======
      throw rethrowAsHttpException(error);
    }
  }

  /**
   * Обновление данных ВУЗа с предварительной проверкой прав доступа.
   */
  async update(id: number, dto: UpdateUniversityDto, currentUser: User): Promise<University> {
    const university = await this.findOne(id, currentUser);
    
    try {
      return await university.update(dto);
    } catch (error) {
      throw rethrowAsHttpException(error);
    }
  }

  /**
   * Удаление ВУЗа с предварительной проверкой прав доступа.
   */
  async remove(id: number, currentUser: User): Promise<void> {
    const university = await this.findOne(id, currentUser);
    await university.destroy();
  }

  /**
   * Проверка прав: может ли текущий пользователь просматривать/изменять данный ВУЗ.
   */
  private async assertVisible(university: University, currentUser: User): Promise<void> {
    const visibleManagerIds = await this.usersService.getVisibleManagerIds(currentUser);
    
    const isAccessRestricted = visibleManagerIds !== null;
    if (isAccessRestricted && !visibleManagerIds.includes(university.managerId)) {
      throw new ForbiddenException('Нет доступа к этому ВУЗу');
    }
  }

  /**
   * Валидация запрашиваемого в фильтре managerId на основе доступных пользователю ID.
   */
  private validateFilterAccess(requestedManagerId: number | undefined, visibleManagerIds: number[] | null): void {
    if (!requestedManagerId) return;

    const isAccessRestricted = visibleManagerIds !== null;
    if (isAccessRestricted && !visibleManagerIds.includes(requestedManagerId)) {
      throw new ForbiddenException('Нет доступа к ВУЗам этого менеджера');
    }
  }

  /**
   * Формирование объекта условий (WhereOptions) для Sequelize на основе переданных фильтров.
   */
  private buildWhereClause(filter: FilterUniversityDto, visibleManagerIds: number[] | null): WhereOptions {
    const where: WhereOptions = {};

    // Ограничение видимости по менеджерам (если применимо)
    if (visibleManagerIds !== null) {
      where['managerId'] = { [Op.in]: visibleManagerIds };
    }

    // Явный фильтр по конкретному менеджеру
    if (filter.managerId) {
      where['managerId'] = filter.managerId;
    }

    // Фильтр по статусу перевода
    if (filter.transferStatus) {
      where['transferStatus'] = filter.transferStatus;
    }

    // Размытый поиск по названию (регистронезависимый)
    if (filter.search) {
      where['name'] = { [Op.iLike]: `%${filter.search}%` };
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
    }

    return where;
  }
<<<<<<< HEAD

  /**
   * Синхронная проверка видимости сущности для пользователя
   */
  private checkVisibility(managerId: number, getVisibleManagerIds: number[] | null): void {
    if (getVisibleManagerIds !== null && !getVisibleManagerIds.includes(managerId)) {
      throw new ForbiddenException('Нет доступа к этому ВУЗу');
    }
  }
}
=======
}
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
