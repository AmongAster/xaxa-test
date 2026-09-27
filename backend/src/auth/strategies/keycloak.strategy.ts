import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UsersService } from '../../users/users.service';

interface KeycloakJwtPayload {
  sub: string; // keycloakId
  email?: string; // может отсутствовать, если у клиента Keycloak не подключён scope "email"
  name?: string;
  preferred_username?: string;
}

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const rawUrl = configService.get<string>('KEYCLOAK_URL') || 'http://localhost:8080';
    const realm = configService.get<string>('KEYCLOAK_REALM') || 'my-crm-realm';
 
    // Гарантированно и безопасно удаляем слеш в конце URL, если он указан в .env
    const sanitizedUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
 
    super({
      // Извлекаем токен из заголовка Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      
      // Динамически скачиваем публичные ключи Keycloak для проверки подписи JWT
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${sanitizedUrl}/realms/${realm}/protocol/openid-connect/certs`,
      }),
      
      // Проверяем издателя токена (должен строго совпадать символ в символ с полем "iss" в JWT)
      // issuer: `${sanitizedUrl}/realms/${realm}`,
      algorithms: ['RS256'],
      
      // Разрешаем стандартную аудиторию "account", которую Keycloak прописывает в access_token
      audience: 'account', 
    });
  }
 
    async validate(payload: KeycloakJwtPayload) {
    // Сюда мы попадаем, ТОЛЬКО если Passport успешно проверил подпись, issuer и audience токена
    try {
      const user = await this.usersService.findOrCreateFromKeycloak(payload);
      
      // Используем .get('isActive') или .getDataValue('isActive') чтобы обойти баг shadowing в Sequelize
      const isActive = user.get ? user.get('isActive') : user.isActive;

      if (!isActive) {
        throw new UnauthorizedException('Учётная запись деактивирована');
      }
      
      return user; // Объект пользователя запишется в request.user
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Пробрасываем нашу ошибку деактивации дальше, не перетирая логом базы данных
      }

      // Отладочный лог на случай, если Sequelize упадет из-за ограничений БД
      console.error('==================================================');
      console.error('🚨 [ОШИБКА БАЗЫ ДАННЫХ В KEYCLOAK STRATEGY]:');
      console.error(error);
      console.error('==================================================');
      
      throw new UnauthorizedException('Ошибка при синхронизации пользователя с базой данных');
    }
  }
}