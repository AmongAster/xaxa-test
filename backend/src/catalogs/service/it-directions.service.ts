import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/sequelize';
import { ITDirection } from '../models/it-direction.model';
import { CreateITDirectionDto, UpdateITDirectionDto } from '../dto/create-itdirection.dto';
import { rethrowAsHttpException } from 'src/common/utils/Sequelize error.util';
 
const CACHE_KEY = 'catalogs:it-directions:all';

@Injectable()
export class ITDirectionsService {
  constructor(
    @InjectModel(ITDirection) private directionModel: typeof ITDirection,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<ITDirection[]> {
    const cached = await this.cacheManager.get<ITDirection[]>(CACHE_KEY);
    if (cached) {
      return cached;
    }
    const directions = await this.directionModel.findAll({ order: [['name', 'ASC']] });
    await this.cacheManager.set(CACHE_KEY, directions);
    return directions;
  }

  async findOne(id: number): Promise<ITDirection> {
    const direction = await this.directionModel.findByPk(id);
    if (!direction) {
      throw new NotFoundException(`ИТ-направление #${id} не найдено`);
    }
    return direction;
  }

  async create(dto: CreateITDirectionDto): Promise<ITDirection> {
    let created: ITDirection;
    try {
      created = await this.directionModel.create(dto as ITDirection);
    } catch (error) {
      // Раньше повторяющееся name (unique-constraint) уходило голым 500.
      rethrowAsHttpException(error);
    }
    await this.invalidateCache();
    return created;
  }

  async update(id: number, dto: UpdateITDirectionDto): Promise<ITDirection> {
    const direction = await this.findOne(id);
    let updated: ITDirection;
    try {
      updated = await direction.update(dto);
    } catch (error) {
      rethrowAsHttpException(error);
    }
    await this.invalidateCache();
    return updated;
  }

  async remove(id: number): Promise<void> {
    const direction = await this.findOne(id);
    await direction.destroy();
    await this.invalidateCache();
  }

  private invalidateCache(): Promise<void> {
    return this.cacheManager.del(CACHE_KEY);
  }
}