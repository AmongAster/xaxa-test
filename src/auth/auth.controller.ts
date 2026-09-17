import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from 'src/users/users.model';
 

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Без @UseGuards — роут открыт, т.к. фронту нужно узнать, куда
  // редиректить на Keycloak ДО того, как у него появится токен.
  
  @Get('login-info')
  @ApiOperation({ summary: 'Параметры для редиректа фронта на Keycloak (без JWT)' })
  loginInfo() {
    return this.authService.getLoginInfo();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Данные текущего пользователя из валидного JWT' })
  me(@CurrentUser() user: User) {
    return this.authService.getProfile(user);
  }
}