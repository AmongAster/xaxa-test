 import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UsersService } from '../../users/users.service'

interface KeycloakJwtPayload {
  sub: string; // keycloakId
  email?: string; // может отсутствовать, если у клиента Keycloak не подключён scope "email"
  name?: string;
  preferred_username?: string;
}
 
/**
 * Как это работает:
 * 1. Keycloak сам подписывает JWT приватным ключом.
 * 2. jwks-rsa на лету скачивает публичный ключ с
 *    {KEYCLOAK_URL}/realms/{realm}/protocol/openid-connect/certs
 *    и кэширует его (secretOrKeyProvider) — так мы не храним ключ руками.
 * 3. Passport проверяет подпись + issuer, и если всё ок — вызывается validate().
 * 4. validate() через UsersService.findOrCreateFromKeycloak() находит ИЛИ
 *    заводит локального User по keycloakId (таблица users — "зеркало"
 *    Keycloak с нашими бизнес-полями: roleId, managerUserId и т.д.,
 *    которых в самом Keycloak нет). Раньше здесь был жёсткий 401, если
 *    юзера не было в БД — теперь первый успешный логин сам заводит запись
 *    с ролью USER по умолчанию (авто-провижининг).
 */
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
    const user = await this.usersService.findOrCreateFromKeycloak(payload);
    if (!user.isActive) {
      throw new UnauthorizedException('Учётная запись деактивирована');
    }
    return user; // попадёт в request.user
  }
}