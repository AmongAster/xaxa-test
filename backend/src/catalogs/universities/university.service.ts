import { Injectable } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversityService {
  create(createUniversityDto: CreateUniversityDto) {
    return ;
  }

  findAll() {
    return ;
  }

  findOne(id: number) {
    return  ;
  }

  update(id: number, updateUniversityDto: UpdateUniversityDto) {
    return  ;
  }

  remove(id: number) {
    return  ;
  }
}
