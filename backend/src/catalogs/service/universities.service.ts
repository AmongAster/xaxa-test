import { Injectable,   } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { University } from "../models/university.model";
import { UsersService } from "src/users/users.service";
 

@Injectable()
export class UniversitiesService {
    constructor(
    @InjectModel(University) private universityModel: typeof University,
    private readonly usersService: UsersService,
  ) {}
}