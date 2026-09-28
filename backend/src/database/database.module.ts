import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLog } from '../audit/audit-log.model';
import { ITDirection } from '../catalogs/models/it-direction.model';
import { ITProduct } from '../catalogs/models/it-product.model';
import { University } from '../catalogs/models/university.model';
 
import { Role } from '../roles/role.model';
import { User } from '../users/users.model';
 
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
        models: [Role, User, University, ITProduct, ITDirection, AuditLog],
        autoLoadModels: true,
        synchronize: true,  
        logging: config.get<string>('NODE_ENV') === 'development' ? console.log : false,
      }),
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}