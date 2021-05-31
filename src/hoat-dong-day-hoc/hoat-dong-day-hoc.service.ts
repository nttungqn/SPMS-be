import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HOATDONGDAYHOC_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { FilterHoatDongDayHoc } from './dto/filter-hoat-đong-day-hoc';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { CreateHoatDongDayHocDTO } from './dto/create-hoat-dong-day-hoc';
import { UsersEntity } from 'users/entity/user.entity';

@Injectable()
export class HoatDongDayHocService {
  constructor(
    @InjectRepository(HoatDongDayHocEntity) private hoatDongDayHocRepository: Repository<HoatDongDayHocEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: FilterHoatDongDayHoc): Promise<HoatDongDayHocEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_HDDH_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType } = filter;
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const [results, total] = await this.hoatDongDayHocRepository
        .createQueryBuilder('hddh')
        .leftJoinAndSelect('hddh.createdBy', 'createdBy')
        .leftJoinAndSelect('hddh.updatedBy', 'updatedBy')
        .where((qb) => {
          searchKey
            ? qb.andWhere('hddh.ma LIKE :search OR hddh.ten LIKE :search', {
                search: `%${searchKey}%`
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `hddh.${sortBy}` : null, sortType);
        })
        .skip(skip)
        .take(limit)
        .andWhere('hddh.isDeleted = false')
        .getManyAndCount();
      result = { contents: results, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_HDDH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number): Promise<HoatDongDayHocEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.hoatDongDayHocRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['createdBy', 'updatedBy']
      });
      if (!result) {
        throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: HoatDongDayHocEntity): Promise<any> {
    const checkExistName = await this.hoatDongDayHocRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_EXIST);
    }
    try {
      const hoatDongDayHoc = await this.hoatDongDayHocRepository.create(newData);
      const saved = await this.hoatDongDayHocRepository.save(hoatDongDayHoc);
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_KEY, saved?.id.toString());
      const detail = await this.findOne(saved.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_TTL);
      await this.delCacheAfterChange();
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.CREATE_HOATDONGDAYHOC_FAILED);
    }
  }

  async update(id: number, updatedData: HoatDongDayHocEntity): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
    }

    // check Ma is exist
    const hoatDongDayHocByMa = await this.hoatDongDayHocRepository.findOne({ ma: updatedData.ma, isDeleted: false });
    if (hoatDongDayHocByMa) {
      throw new ConflictException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_EXIST);
    }

    try {
      const result = await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_KEY, id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.UPDATE_HOATDONGDAYHOC_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const hoatDongDayHoc = await this.hoatDongDayHocRepository.findOne({ id, isDeleted: false });
    if (!hoatDongDayHoc) {
      throw new NotFoundException(HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND);
    }
    try {
      const result = await this.hoatDongDayHocRepository.save({
        ...hoatDongDayHoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_FAILED);
    }
  }
  async isInSyllabus(idHoatDongDanhGia: number, idSyllabus: number) {
    throw new InternalServerErrorException(`HOATDONGDAYHOC_${idHoatDongDanhGia}_NOT_IN_SYLLABUS`);
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.hoatDongDayHocRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_HDDH_CACHE_COMMON_KEY]);
  }

  async addList(data: Array<CreateHoatDongDayHocDTO>, user: UsersEntity) {
    const newData = [];
    data.forEach((value, index) => {
      newData[index] = {
        ...value,
        createdBy: user?.id,
        updatedBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      delete newData[index]['id'];
    });
    return await this.hoatDongDayHocRepository.save(newData);
  }
}
