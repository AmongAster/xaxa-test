import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = any>(err: any, user: TUser | false, info: any): TUser {
    if (err || !user) {
      // НАДЕЖНОЕ ИЗВЛЕЧЕНИЕ ОШИБКИ: проверяем как стандартный Error, так и объект NestJS Exception (err.response)
      let reason = 'неизвестная причина';
      
      if (err) {
        reason = err.response?.message || err.message || JSON.stringify(err);
      } else if (info) {
        reason = info.message || JSON.stringify(info);
      }

      this.logger.warn(`JWT отклонён: ${reason}`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
