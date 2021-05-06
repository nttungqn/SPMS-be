import { ForbiddenException } from '@nestjs/common';
import { ROLES_MESSAGE } from 'constant/constant';
import { Role } from './roles.enum';

export class BaseService {
  protected checkPermission(createdBy: any, updatedBy: any) {
    if (!createdBy) throw new ForbiddenException(ROLES_MESSAGE.NOT_OWNER);
    if (updatedBy.role['value'] === Role.ADMIN) return;
    const { id } = createdBy;
    if (id !== updatedBy) throw new ForbiddenException(ROLES_MESSAGE.NOT_OWNER);
  }
}
