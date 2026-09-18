import { Module } from '@nestjs/common';
import { UniversityService } from './university.controller';
import { UniversityController } from './university.controller';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
