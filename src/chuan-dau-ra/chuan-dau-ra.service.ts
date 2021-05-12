import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURA_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { CreateChuanDauRaDto } from './dto/createChuanDauRa.dto';
import { ChuanDauRaEntity } from './entity/chuanDauRa.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class ChuanDauRaService {
  constructor(
    @InjectRepository(ChuanDauRaEntity) private readonly chuanDauRaRepository: Repository<ChuanDauRaEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: any): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_CDR_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit = LIMIT, page = 0, search = '', ...rest } = filter;
      const skip = Number(page) * Number(limit);
      const querySearch = search ? { ten: Like(`%${search}%`) } : {};
      const query = {
        isDeleted: false,
        ...querySearch,
        ...rest
      };
      const list = await this.chuanDauRaRepository.find({
        relations: ['createdBy', 'updatedBy'],
        skip,
        take: limit,
        where: query
      });
      if (!list.length) {
        throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_EMPTY, HttpStatus.NOT_FOUND);
      }
      const total = await this.chuanDauRaRepository.count({ ...query });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CDR_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CDR_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.chuanDauRaRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['createdBy', 'updatedBy']
      });
      if (!result) {
        throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CDR_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: CreateChuanDauRaDto): Promise<any> {
    const checkExistData = await this.chuanDauRaRepository.findOne({
      ten: newData?.ten,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_IS_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuanDauRa = await this.chuanDauRaRepository.create(newData);
      const result = await this.chuanDauRaRepository.save(newChuanDauRa);
      const key = format(REDIS_CACHE_VARS.DETAIL_CDR_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: CreateChuanDauRaDto): Promise<any> {
    const chuanDauRa = await this.chuanDauRaRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRa) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chuanDauRaRepository.save({
        ...chuanDauRa,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDR_CACHE_KEY, id.toString());
      await this.cacheManager.set(key, updated, REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_TTL);
      await this.delCacheAfterChange();
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chuanDauRa = await this.chuanDauRaRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRa) {
      throw new HttpException(CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chuanDauRaRepository.save({
        ...chuanDauRa,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDR_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chuanDauRaRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHUANDAURA_MESSAGE.DELETE_CHUANDAURA_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_CDR_CACHE_COMMON_KEY]);
  }
}
