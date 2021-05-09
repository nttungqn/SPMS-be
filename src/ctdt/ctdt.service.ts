import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, NGANHDAOTAO_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository, Like } from 'typeorm';
import { NganhDaoTaoEntity } from './entity/nganhDaoTao.entity';
import { INganhDaoTao } from './interfaces/nganhDaoTao.interface';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class CtdtService {
  constructor(
    @InjectRepository(NganhDaoTaoEntity) private readonly nganhDaoTaoRepository: Repository<NganhDaoTaoEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: any): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_NDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, ...otherParam } = filter;
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const searchField = ['id', 'maNganhDaoTao', 'ten'];
      const searchQuery = searchField
        .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'ndt.' + e + ' LIKE :search'))
        .join(' OR ');
      const [list, total] = await this.nganhDaoTaoRepository
        .createQueryBuilder('ndt')
        .leftJoinAndSelect('ndt.chuongTrinhDaoTao', 'chuongTrinhDaoTao', 'chuongTrinhDaoTao.isDeleted = false')
        .leftJoinAndSelect('ndt.createdBy', 'createdBy')
        .leftJoinAndSelect('ndt.updatedBy', 'updatedBy')
        .where((qb) => {
          searchKey
            ? qb.andWhere(searchQuery, {
                search: `%${searchKey}%`
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `ndt.${sortBy}` : null, sortType);
        })
        .andWhere({ isDeleted: false, ...otherParam })
        .skip(skip)
        .take(limit)
        .getManyAndCount();
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_NDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_NDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.nganhDaoTaoRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['chuongTrinhDaoTao', 'createdBy', 'updatedBy']
      });
      if (!result) {
        throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_NDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: INganhDaoTao): Promise<any> {
    const checkExistName = await this.nganhDaoTaoRepository.findOne({
      ten: newData?.ten,
      chuongTrinhDaoTao: newData?.chuongTrinhDaoTao,
      isDeleted: false
    });
    if (checkExistName) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_NAME_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newNganhDaoTao = await this.nganhDaoTaoRepository.create(newData);
      const saved = await this.nganhDaoTaoRepository.save(newNganhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: INganhDaoTao): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ id, isDeleted: false });
    if (!nganhDaoTao) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.nganhDaoTaoRepository.save({ ...nganhDaoTao, ...updatedData, updatedAt: new Date() });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const nganhDaoTao = await this.nganhDaoTaoRepository.findOne({ id, isDeleted: false });
    if (!nganhDaoTao) {
      throw new HttpException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.nganhDaoTaoRepository.save({
        ...nganhDaoTao,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getCount(): Promise<number> {
    return await this.nganhDaoTaoRepository.count({ isDeleted: false });
  }
}
