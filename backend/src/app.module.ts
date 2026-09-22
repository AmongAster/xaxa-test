import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { WorkflowModule } from './workflow/workflow.module';
import { ReportsModule } from './reports/reports.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
    UsersModule, 
    RolesModule, 
    CatalogsModule,
     WorkflowModule,
      ReportsModule,
      CacheModule.register()], 
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
