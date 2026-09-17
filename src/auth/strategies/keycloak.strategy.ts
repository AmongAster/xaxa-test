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
    const user = await this.usersService.findByKeycloakId(payload.sub);
    if (!user) {

      throw new UnauthorizedException(
        'Пользователь авторизован в Keycloak, но не найден в CRM. Обратитесь к администратору.',
      );
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Учётная запись деактивирована');
    }
    return user; 
  }
}