import { BadRequestException, ConflictException } from '@nestjs/common';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';

export function rethrowAsHttpException(error: unknown): never {
  if (error instanceof ForeignKeyConstraintError) {
    throw new BadRequestException(
      'Одно из указанных ID ссылается на несуществующую запись (проверьте managerId/directionId/universityId)',
    );
  }
  if (error instanceof UniqueConstraintError) {
    throw new ConflictException('Запись с такими уникальными данными уже существует');
  }
  throw error;
}