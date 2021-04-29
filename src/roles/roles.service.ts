import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, ROLES_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
import { FilterRoles } from './dto/filter-roles.dto';
import { RolesEntity } from './entity/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>
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

  async findAll(filter: FilterRoles) {
    const { page = 0, limit = LIMIT, searchKey, sortBy, sortType } = filter;
    const skip = page * limit;
    const [results, total] = await this.rolesRepository
      .createQueryBuilder('role')
      .where('role.name LIKE :searchName OR role.value = :searchValue', {
        searchName: `%${searchKey}%`,
        searchValue: Number.isNaN(Number(searchKey)) ? -1 : searchKey
      })
      .andWhere('role.isDeleted = true')
      .skip(skip)
      .take(limit)
      .orderBy(sortBy ? `role.${sortBy}` : null, sortType)
      .getManyAndCount();
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number) {
    const result = await this.rolesRepository.findOne(id, {
      where: { isDeleted: false }
    });
    if (!result) {
      throw new NotFoundException(ROLES_MESSAGE.ROLES_ID_NOT_FOUND);
    }
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
}
