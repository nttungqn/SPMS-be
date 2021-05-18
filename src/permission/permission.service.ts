import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { createQueryBuilder, Repository } from 'typeorm';
import { FilterPermision } from './dto/filter-permission.dto';
import { PermissionEntity } from './entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private perrmissionRepository: Repository<PermissionEntity>
  ) {}

  async findAll(filter: FilterPermision) {
    const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType } = filter;
    const skip = page * limit;
    try {
      const [results, total] = await this.perrmissionRepository
        .createQueryBuilder('prm')
        .where((qb) => {
          searchKey
            ? qb.andWhere('(prm.name LIKE :search OR prm.path LIKE :search OR prm.method LIKE :search)', {
                search: `%${searchKey}%`
              })
            : {};
        })
        .take(limit)
        .skip(skip)
        .orderBy(sortBy ? `prm.${sortBy}` : null, sortType)
        .getManyAndCount();
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      return new InternalServerErrorException();
    }
  }
}
