import { ForbiddenException } from '@nestjs/common';
import { ROLES_MESSAGE } from 'constant/constant';

export class BaseService {
  protected isOwner(createdBy: any, updatedBy: number) {
    const { id } = createdBy;
    if (id !== updatedBy) throw new ForbiddenException(ROLES_MESSAGE.NOT_OWNER);
  }
}
