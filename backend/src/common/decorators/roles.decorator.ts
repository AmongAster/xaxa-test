import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../../roles/role.model';
 
export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);