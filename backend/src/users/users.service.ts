import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { Role } from 'src/roles/role.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User) {}

  findAll(): Promise<User[]> {
    return this.userModel.findAll({ include: [Role] });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id, { include: [Role] });
    if (!user) {
      throw new NotFoundException(`Пользователь #${id} не найден`);
    }
    return user;
  }

  findByKeycloakId(keycloakId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { keycloakId }, include: [Role] });
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto as any);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    return user.update(dto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
  }

  /**
   * Возвращает список ID пользователей, чьи данные видны текущему юзеру:
   * - ADMIN: null (без ограничений)
   * - MANAGER: сам + все подчиненные
   * - USER: только сам
   */
  async getVisibleManagerIds(currentUser: User): Promise<number[] | null> {
    if (currentUser.role?.name === 'ADMIN') {
      return null;
    }

    if (currentUser.role?.name === 'MANAGER') {
      const subordinates = await this.userModel.findAll({
        where: { managerUserId: currentUser.id },
        attributes: ['id'],
      });
      return [currentUser.id, ...subordinates.map((s) => s.id)];
    }

    return [currentUser.id];
  }

  findManyByIds(ids: number[]): Promise<User[]> {
    return this.userModel.findAll({ 
      where: { id: { [Op.in]: ids } } 
    });
  }
}