import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { LIMIT, REDIS_CACHE_VARS, ROLES_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { FilterRoles } from './dto/filter-roles.dto';
import { RolesEntity } from './entity/roles.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async create(newData: RolesEntity) {
    try {
      const result = await this.rolesRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ROLES_MESSAGE.CREATE_ROLES_FAILED);
    }
  }

  async findAll(filter: FilterRoles) {
    const key = format(REDIS_CACHE_VARS.LIST_ROLE_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { page = 0, limit = LIMIT, searchKey, sortBy, sortType } = filter;
      const skip = page * limit;
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const [results, total] = await this.rolesRepository
        .createQueryBuilder('role')
        .where((qb) => {
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `role.${sortBy}` : null, sortType);
          searchKey
            ? qb.andWhere('role.name LIKE :searchName OR role.value = :searchValue', {
                searchName: `%${searchKey}%`,
                searchValue: Number.isNaN(Number(searchKey)) ? -1 : searchKey
              })
            : {};
        })
        .andWhere('role.isDeleted = false')
        .skip(skip)
        .take(limit)
        .getManyAndCount();
      result = { contents: results, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_ROLE_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.rolesRepository.findOne(id, {
        where: { isDeleted: false }
      });
      if (!result) {
        throw new NotFoundException(ROLES_MESSAGE.ROLES_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: RolesEntity) {
    const oldData = await this.rolesRepository.findOne(id, { where: { isDeleted: false } });
    try {
      const result = await this.rolesRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
      const key = format(REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_KEY, id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ROLES_MESSAGE.UPDATE_ROLES_FAILED);
    }
  }

  async remove(id: number) {
    const data = await this.rolesRepository.findOne(id, { where: { isDeleted: false } });
    if (!data) throw new NotFoundException(ROLES_MESSAGE.ROLES_ID_NOT_FOUND);
    try {
      const result = await this.rolesRepository.save({
        ...data,
        updatedAt: new Date(),
        isDeleted: true
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ROLES_MESSAGE.DELETE_ROLES_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.rolesRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ROLES_MESSAGE.DELETE_ROLES_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_ROLE_CACHE_COMMON_KEY]);
  }
  async getAllPermissions(idRole: number): Promise<RolesEntity> {
    const found = await this.rolesRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'per', 'per.actived = true ')
      .where({ id: idRole, isDeleted: false })
      .getOne();
    if (!found) throw new ForbiddenException(ROLES_MESSAGE.NO_PERMISTION);
    return found;
  }
}
