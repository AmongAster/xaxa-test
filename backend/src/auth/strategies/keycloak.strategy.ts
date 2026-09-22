 import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UsersService } from '../../users/users.service';

interface KeycloakJwtPayload {
  sub: string; // keycloakId
  email: string;
  name?: string;
  preferred_username?: string;
}

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const keycloakUrl = configService.get<string>('KEYCLOAK_URL');
    const realm = configService.get<string>('KEYCLOAK_REALM');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      }),
      issuer: `${keycloakUrl}/realms/${realm}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: KeycloakJwtPayload) {
    // 1. Ищем пользователя в базе CRM по его ID из Keycloak (поле sub)
    let user = await this.usersService.findByKeycloakId(payload.sub);

    // 2. Если пользователя нет в базе данных CRM — создаем его автоматически
    if (!user) {
      user = await this.usersService.create({
        keycloakId: payload.sub,
        email: payload.email,
        fullName: payload.name || payload.preferred_username || 'Новый пользователь',
        roleId: 2, 
      });
      
      console.log(`[Keycloak Auto-Register] Пользователь ${payload.email} сохранен в БД CRM.`);
    }

    // 3. Если пользователь найден, но администратор его отключил
    if (!user.isActive) {
      throw new UnauthorizedException('Учётная запись деактивирована');
    }

    // 4. Возвращаем объект пользователя из БД.
    // Passport прикрепит его к request.user, и декоратор @CurrentUser() сможет его прочитать
    return user; 
  }
}