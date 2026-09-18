import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducationalProgramService } from './educational-program.service';
import { CreateEducationalProgramDto } from './dto/create-educational-program.dto';
import { UpdateEducationalProgramDto } from './dto/update-educational-program.dto';

@Controller('educational-program')
export class EducationalProgramController {
  constructor(private readonly educationalProgramService: EducationalProgramService) {}

  @Post()
  create(@Body() createEducationalProgramDto: CreateEducationalProgramDto) {
    return this.educationalProgramService.create(createEducationalProgramDto);
  }

  @Get()
  findAll() {
    return this.educationalProgramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationalProgramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEducationalProgramDto: UpdateEducationalProgramDto) {
    return this.educationalProgramService.update(+id, updateEducationalProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationalProgramService.remove(+id);
  }
}
