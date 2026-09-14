import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
    @InjectModel(Users) private userRepository: typeof Users,
  ){}
    async createUser(dto: CreateUserDto){
        const existingUser = await this.userRepository.findOne({
        where: {email: dto.email}})
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll()
        return users.map((users) => this.sanitizeUser(users));
    }

    async getUserById(id:number){
        const user = await this.userRepository.findByPk(id);

        if(!user){
            throw new NotFoundException("Пользователь с таким id не найден");
        }
    }

    async getUserByEmail(email: string){
        const user = await this.userRepository.findOne({
            where: {email},
        });

        if(!user) {
            throw new NotFoundException("Пользователь с таким email не найден")
        }
    }

    async udpateUser(id: number, dto:UpdateUserDto){
      const user = await this.userRepository.findByPk(id);

      if(!user){
        throw new NotFoundException('Пользователь с таким id не найден')
      }
      if (dto.email && dto.email !== user.email){
        const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
        })
      
        if (existingUser){
          throw new ConflictException('такой Email уже занят');
      }
    }
      await user.update(dto);
      return this.sanitizeUser(user);
    }
    
    async deleteUser(id: number){
        const user = await this.userRepository.findByPk(id)

        if(!user){
          throw new NotFoundException('Пользователь с таким id не найден')
        }
          await user.destroy();
          
          return {message: 'Пользователь успешно удалён'};
        }

        //private
        private sanitizeUser(user: Users){
        const userObj = user.toJSON() as any;
        delete userObj.password;
        return userObj;
        }
      }
