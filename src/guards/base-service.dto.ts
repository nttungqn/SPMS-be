import { ForbiddenException } from '@nestjs/common';
import { ROLES_MESSAGE } from 'constant/constant';

export class BaseService {
  protected isOwner(createdBy: number, updatedBy: number) {
    if (createdBy !== updatedBy) throw new ForbiddenException(ROLES_MESSAGE.NOT_OWNER);
  }
}
