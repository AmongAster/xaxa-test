import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private readonly roleModel: typeof Role){}

    async getAll(): 
}
