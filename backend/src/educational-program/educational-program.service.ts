import { Injectable } from '@nestjs/common';
import { CreateEducationalProgramDto } from './dto/create-educational-program.dto';
import { UpdateEducationalProgramDto } from './dto/update-educational-program.dto';

@Injectable()
export class EducationalProgramService {
  create(createEducationalProgramDto: CreateEducationalProgramDto) {
    return  ;
  }

  findAll() {
    return  ;
  }

  findOne(id: number) {
    return  ;
  }

  update(id: number, updateEducationalProgramDto: UpdateEducationalProgramDto) {
    return  ;
  }

  remove(id: number) {
    return  ;
  }
}
