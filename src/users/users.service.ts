import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  remove(id: number) {
    throw new Error('Method not implemented.');
  }
  update(id: number, dto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  findById(id: number) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
  
  
  findByKeycloakId: any;
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async getAll() {
    return this.userModel.findAll();
  }

  async getById(id: string) {
    return this.userModel.findByPk(id);
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }
}