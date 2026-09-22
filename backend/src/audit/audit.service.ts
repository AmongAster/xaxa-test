import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditAction, AuditLog } from './audit-log.model';

export interface WriteAuditLogParams {
  userId?: number;
  action: AuditAction;
  entityType: string;
  entityId?: string | number;
  ipAddress?: string;
  userAgent?: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@InjectModel(AuditLog) private auditLogModel: typeof AuditLog) {}

 
  async write(params: WriteAuditLogParams): Promise<void> {
    try {
      await this.auditLogModel.create({
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId != null ? String(params.entityId) : null,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        payload: params.payload,
      } as AuditLog);
    } catch (err) {
 
      if (err instanceof Error) {
        this.logger.error(`Не удалось записать AuditLog: ${err.message}`, err.stack);
      } else {
 
        this.logger.error(`Не удалось записать AuditLog: Произошла неизвестная ошибка`, String(err));
      }
    }
  }
}
