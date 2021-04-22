import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_MESSAGE } from 'constant/constant';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (requiredRoles === undefined) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const roleUser = user.role['value'];
    if (!requiredRoles.includes(roleUser)) {
      throw new ForbiddenException(ROLES_MESSAGE.NO_PERMISTION);
    }
    return true;
  }
}
