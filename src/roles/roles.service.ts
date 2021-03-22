import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { LIMIT, ROLES_MESSAGE } from 'constant/constant';
import { Repository } from 'typeorm';
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

  async findAll(filter: BaseFilterDto) {
    const { page = 0, limit = LIMIT, ...other } = filter;
    const skip = page * limit;
    const [results, total] = await this.rolesRepository.findAndCount({
      skip,
      take: limit,
      ...other
    });
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
