import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { RolesService } from 'roles/roles.service';
import { Repository } from 'typeorm';
import { FilterPermission } from './dto/filter-permission.dto';
import { ResourceEntity } from './entity/resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private resourceRepository: Repository<ResourceEntity>,
    @Inject(forwardRef(() => RolesService))
    private roleService: RolesService
  ) {}

  async findAllPermission(idRole: number, filter: FilterPermission) {
    await this.roleService.findOne(idRole);
    const { page = 0, limit = LIMIT, searchKey = '' } = filter;
    const skip = page * limit;
    const query = this.resourceRepository
      .createQueryBuilder('rs')
      .leftJoinAndSelect('rs.permission', 'pms', 'pms.idRole = :idRole', { idRole })
      .take(Number(limit) === -1 ? null : Number(limit))
      .skip(skip);
    searchKey
      ? query.andWhere('(rs.name LIKE :searchName OR rs.description LIKE :searchName)', {
          searchName: `%${searchKey}%`
        })
      : {};
    const [recource, total] = await query.getManyAndCount();
    recource.forEach((e) => {
      const methods = ['get', 'post', 'put', 'delete'];
      methods.forEach((mt) => {
        if (e.permission.findIndex((e) => e.method === mt) == -1) {
          e.permission.push({ idRole: Number(idRole), resource: e.name, method: mt, isEnable: false });
        }
      });
    });
    return { contents: recource, total, page: Number(page) };
  }
}
