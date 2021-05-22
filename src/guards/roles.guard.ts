import { Injectable, CanActivate, ExecutionContext, ForbiddenException, forwardRef, Inject } from '@nestjs/common';
import { ROLES_MESSAGE } from 'constant/constant';
import { PermissionEntity } from 'permission/entity/permission.entity';
import { PermissionService } from 'permission/permission.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => PermissionService))
    private permissionService: PermissionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, route } = context.switchToHttp().getRequest();
    const resource = (route.path + '').split('/')[1].toLocaleUpperCase();
    const methodArr = ['get', 'post', 'put', 'delete'];
    let permission: PermissionEntity;
    try {
      for (const mt of methodArr) {
        if (route.methods[mt] == true) {
          permission = await this.permissionService.findOne(user.role.id, resource, mt);
          break;
        }
      }
    } catch (error) {
      throw new ForbiddenException(ROLES_MESSAGE.NO_PERMISTION);
    }
    if (permission.isEnable === false) {
      throw new ForbiddenException(ROLES_MESSAGE.NO_PERMISTION);
    }
    return true;
  }
}
