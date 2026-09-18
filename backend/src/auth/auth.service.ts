import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/users.model';
 

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  getLoginInfo() {
    const keycloakUrl = this.configService.get<string>('KEYCLOAK_URL');
    const realm = this.configService.get<string>('KEYCLOAK_REALM');
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');
    return {
      authUrl: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth`,
      tokenUrl: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      clientId,
    };
  }

  getProfile(user: User) {
    return user;
  }
}