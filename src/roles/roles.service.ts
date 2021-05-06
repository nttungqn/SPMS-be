import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { LIMIT, REDIS_CACHE_VARS, ROLES_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
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
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ROLES_MESSAGE.CREATE_ROLES_FAILED);
    }
  }

  async findAll(filter: BaseFilterDto) {
    const key = format(REDIS_CACHE_VARS.LIST_ROLE_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { page = 0, limit = LIMIT, ...other } = filter;
      const skip = page * limit;
      const [list, total] = await this.rolesRepository.findAndCount({
        skip,
        take: limit,
        where: { isDeleted: false },
        ...other
      });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_ROLE_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_ROLE_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
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
      return await this.rolesRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(ROLES_MESSAGE.UPDATE_ROLES_FAILED);
    }
  }

  async remove(id: number) {
    const result = await this.rolesRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(ROLES_MESSAGE.ROLES_ID_NOT_FOUND);
    try {
      return await this.rolesRepository.save({
        ...result,
        updatedAt: new Date(),
        isDeleted: true
      });
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
}
