import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { ResourcesService } from 'resources/resources.service';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>
  ) {}

  async savePermissons(permissions: PermissionEntity[], idRole: number) {
    const resourceArr = [];
    const methodArr = ['get', 'post', 'put', 'delete'];
    permissions.forEach((e) => {
      if (!resourceArr.includes(e.resource)) {
        resourceArr.push(e.resource);
      }
      if (!methodArr.includes(e.method)) {
        throw new BadRequestException();
      }
      e.idRole = Number(idRole);
    });
    //await this.resourceService.isEixstResource(resourceArr)
    try {
      await this.permissionRepository.save(permissions);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async findOne(idRole: number, resource: string, method: string): Promise<PermissionEntity> {
    const found = await this.permissionRepository.findOne({ where: { idRole, resource, method } });
    if (!found) throw new NotFoundException();
    return found;
  }
  async getPermissionByArrId(permissionArr: string[]) {
    try {
      const [results, total] = await this.permissionRepository
        .createQueryBuilder('prm')
        .andWhere('prm.id in (:...permissionArr)', { permissionArr })
        .getManyAndCount();
      return results;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async updatePermission(permissions: PermissionEntity[], idRole: number) {
    permissions.forEach((e) => (e.idRole = idRole));
    try {
      for (const per of permissions) {
        per.idRole = idRole;
        const old = await this.permissionRepository.findOne({
          idRole: idRole,
          resource: per.resource,
          method: per.method
        });
        if (old) {
          await this.permissionRepository.update(old, per);
        } else {
          await this.permissionRepository.save(per);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
