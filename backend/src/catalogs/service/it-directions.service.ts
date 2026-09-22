import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
<<<<<<< HEAD
<<<<<<< HEAD
import { type Cache } from 'cache-manager';
=======
import type { Cache } from 'cache-manager'; 
>>>>>>> 78a8f4f968d570f6546ca46cf7d23f14d2f55029
=======
import type { Cache } from 'cache-manager'; 
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
import { InjectModel } from '@nestjs/sequelize';
import { ITDirection } from '../models/it-direction.model';
import { CreateITDirectionDto, UpdateITDirectionDto } from '../dto/create-itdirection.dto';
import { rethrowAsHttpException } from 'src/common/utils/Sequelize error.util';

const CACHE_KEY = 'catalogs:it-directions:all';

@Injectable()
export class ITDirectionsService {
  constructor(
    @InjectModel(ITDirection) 
    private readonly directionModel: typeof ITDirection,
    @Inject(CACHE_MANAGER) 
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ITDirection[]> {
    const cached = await this.cacheManager.get<ITDirection[]>(CACHE_KEY);
<<<<<<< HEAD
<<<<<<< HEAD
    if (cached) {
      return cached;
    }

=======
    if (cached) return cached;
    
>>>>>>> 78a8f4f968d570f6546ca46cf7d23f14d2f55029
=======
    if (cached) return cached;
    
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
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
    try {
<<<<<<< HEAD
<<<<<<< HEAD
      const created = await this.directionModel.create(dto as any);
      await this.invalidateCache();
      return created;
    } catch (error) {
      rethrowAsHttpException(error);
=======
      const created = await this.directionModel.create(dto as unknown as ITDirection);
      await this.invalidateCache();
      return created;
    } catch (error) {
      throw rethrowAsHttpException(error); 
>>>>>>> 78a8f4f968d570f6546ca46cf7d23f14d2f55029
=======
      const created = await this.directionModel.create(dto as unknown as ITDirection);
      await this.invalidateCache();
      return created;
    } catch (error) {
      throw rethrowAsHttpException(error); 
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
    }
  }

  async update(id: number, dto: UpdateITDirectionDto): Promise<ITDirection> {
    const direction = await this.findOne(id);
    
    try {
      const updated = await direction.update(dto);
      await this.invalidateCache();
      return updated;
    } catch (error) {
      throw rethrowAsHttpException(error);
    }
  }

  async remove(id: number): Promise<void> {
    const direction = await this.findOne(id);
    
    await direction.destroy();
    await this.invalidateCache();
  }

  private async invalidateCache(): Promise<void> {
    await this.cacheManager.del(CACHE_KEY);
  }
}
