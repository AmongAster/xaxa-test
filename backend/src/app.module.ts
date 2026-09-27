import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisCacheModule } from './cache/redis-cache.module';
import { RolesModule } from './roles/roles.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';
import { WorkflowModule } from './workflow/workflow.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    DatabaseModule,
    RedisCacheModule,
    AuditModule,
    UsersModule,
    RolesModule,
    // AuthModule НЕ регистрирует guard'ы глобально — каждый защищённый
    // контроллер вешает @UseGuards(JwtAuthGuard, RolesGuard) на себя явно.
    AuthModule,
    CatalogsModule,
    ReportsModule,
    WorkflowModule
  ],
})
export class AppModule {}