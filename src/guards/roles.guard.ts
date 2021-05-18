import { Injectable, CanActivate, ExecutionContext, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_MESSAGE } from 'constant/constant';
import { PermissionEntity } from 'permission/entity/permission.entity';
import { RolesService } from 'roles/roles.service';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => RolesService))
    private roleService: RolesService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (requiredRoles === undefined) {
      return true;
    }
    const { user, route } = context.switchToHttp().getRequest();
    const role = await this.roleService.getAllPermissions(user.role.id);
    if (!roleAccept(role.permissions, route)) {
      throw new ForbiddenException(ROLES_MESSAGE.NO_PERMISTION);
    }
    return true;
  }
}
function roleAccept(permissions: PermissionEntity[], route: any): boolean {
  for (const per of permissions) {
    if (
      per.path.toLocaleLowerCase() === route.path.toLocaleLowerCase() &&
      route.methods[per.method.toLocaleLowerCase()]
    )
      return true;
  }
  return false;
}
