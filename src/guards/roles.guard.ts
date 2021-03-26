import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (requiredRoles === undefined) {
      return true;
    }
    const getRole = this.roleAcceptFactoty(requiredRoles);
    const { user } = context.switchToHttp().getRequest();
    const roleUser = user.role['value'];
    if (!getRole.includes(roleUser)) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private roleAcceptFactoty(role: Role): Role[] {
    switch (role) {
      case Role.USER:
        return [Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN];
      case Role.SINHVIEN:
        return [Role.SINHVIEN];
      case Role.GIAOVIEN:
        return [Role.GIAOVIEN];
      case Role.QUANLY:
        return [Role.QUANLY, Role.ADMIN];
      case Role.ADMIN:
        return [Role.ADMIN];
    }
  }
}
