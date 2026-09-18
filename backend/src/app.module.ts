import { Module } from '@nestjs/common';
import { UniversityModule } from './catalogs/universities/university.module';
import { InteractionModule } from './interaction/interaction.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ReportsModule } from './reports/reports.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [UniversityModule, 
    InteractionModule, 
    UsersModule, 
    RolesModule, 
    CatalogsModule,
     WorkflowModule,
      ReportsModule], 
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
