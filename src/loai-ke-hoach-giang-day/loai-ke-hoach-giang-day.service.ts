import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, LOAIKEHOACHGIANGDAY_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { fliterLoaiKeHoachGiangDay } from './dto/fliterLoaiKeHoachGiangDay.dto';

@Injectable()
export class LoaiKeHoachGiangDayService {
  constructor(
    @InjectRepository(LoaiKeHoachGiangDayEntity)
    private loaiKeHoachGiangDayEntity: Repository<LoaiKeHoachGiangDayEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter): Promise<LoaiKeHoachGiangDayEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_LKHGD_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
      const skip = Number(page) * Number(limit);
      const querySearch = search ? { ten: Like(`%${search}%`) } : {};
      const query = {
        isDeleted: false,
        ...querySearch,
        ...otherParam
      };

      const list = await this.loaiKeHoachGiangDayEntity.find({
        where: query,
        skip,
        take: Number(limit) === -1 ? null : Number(limit),
        relations: ['createdBy', 'updatedBy']
      });
      const total = await this.loaiKeHoachGiangDayEntity.count({ ...query });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_LKHGD_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<LoaiKeHoachGiangDayEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.loaiKeHoachGiangDayEntity.findOne({
        where: { id, isDeleted: false },
        relations: ['createdBy', 'updatedBy']
      });
      if (!result) {
        throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_TTL);
    }
    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: LoaiKeHoachGiangDayEntity): Promise<any> {
    const checkExistName = await this.loaiKeHoachGiangDayEntity.findOne({
      where: { ma: newData?.ma, isDeleted: false },
      relations: ['createdBy', 'updatedBy']
    });
    if (checkExistName) {
      throw new ConflictException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_EXIST);
    }
    newData.ma = newData.ma.toUpperCase().trim();
    try {
      const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.create(newData);
      const result = await this.loaiKeHoachGiangDayEntity.save(loaiKeHoachGiangDay);
      const key = format(REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_KEY, result?.id.toString());
      const detail = await this.findById(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.CREATE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async update(id: number, updatedData: LoaiKeHoachGiangDayEntity): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ id, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
    }

    // check Ma is exist
    const monHocByMa = await this.loaiKeHoachGiangDayEntity.findOne({ ma: updatedData.ma, isDeleted: false });
    if (monHocByMa) {
      throw new ConflictException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_EXIST);
    }

    try {
      const result = await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findById(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const loaiKeHoachGiangDay = await this.loaiKeHoachGiangDayEntity.findOne({ id, isDeleted: false });
    if (!loaiKeHoachGiangDay) {
      throw new NotFoundException(LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND);
    }
    try {
      const result = await this.loaiKeHoachGiangDayEntity.save({
        ...loaiKeHoachGiangDay,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_LKHGD_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.loaiKeHoachGiangDayEntity.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_KHGD_CACHE_COMMON_KEY]);
  }
}
