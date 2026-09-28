import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Global() // Делаем модуль глобальным, чтобы не импортировать его в каждом модуле
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Инициализируем redisStore с настройками хоста и порта
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
          // В cache-manager-redis-yet TTL задается в миллисекундах (например, 5 минут)
          ttl: configService.get<number>('REDIS_TTL', 5 * 60 * 1000), 
        });

        return {
          store: store as any, // Приведение типов необходимо из-за нюансов совместимости типов NestJS и пакета store
        };
      },
    }),
  ],
  exports: [CacheModule], // Экспортируем CacheModule для доступа к CACHE_MANAGER в сервисах
})
export class RedisCacheModule {}
