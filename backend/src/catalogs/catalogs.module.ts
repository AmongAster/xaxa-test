import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from './models/university.model';
import { ITDirection } from './models/it-direction.model';
import { ITProduct } from './models/it-product.model';
import { UsersModule } from '../users/users.module';
import { UniversitiesService } from './service/universities.service';
import { ITDirectionsService } from './service/it-directions.service';
import { ITProductsService } from './service/it-products.service';
import { ITDirectionController } from './controller/it-directions.controller';
import { UniversitiesController } from './controller/universities.controller';
import { ITProductsController } from './controller/it-products.controller';

 

@Module({
  imports: [
    SequelizeModule.forFeature([University, ITDirection, ITProduct]),
    UsersModule, 
  ],
  controllers: [ITDirectionController, UniversitiesController, ITProductsController],
  providers: [UniversitiesService, ITDirectionsService, ITProductsService,],
  exports: [SequelizeModule],
})
export class CatalogsModule {}