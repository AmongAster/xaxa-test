import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { University } from 'src/catalogs/models/university.model';
 
import { Role } from 'src/roles/role.model';
import { User } from 'src/users/users.model';
 
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'crm_it_school'),
        models: [Role, User, University,],
        autoLoadModels: true,
        synchronize: false,  
        logging: config.get<string>('NODE_ENV') === 'development' ? console.log : false,
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}