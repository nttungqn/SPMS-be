import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChiTietNganhDaoTaoService } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { KEHOACHGIANGDAY_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm';
import { CreateKeHoachGiangDayDto } from './dto/createKeHoachGiangDay.dto';
import { KeHoachGiangDayEntity } from './entity/keHoachGiangDay.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { UpdateKeHoachGiangDayDto } from './dto/updateKeHoachGiangDay.dto';

@Injectable()
export class KeHoachGiangDayService {
  constructor(
    @InjectRepository(KeHoachGiangDayEntity)
    private readonly keHoachGiangDayRepository: Repository<KeHoachGiangDayEntity>,
    private readonly chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: any): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_KHGD_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      try {
        const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, CTNganhDaoTao, ...otherParam } = filter;
        const skip = Number(page) * Number(limit);
        const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
        const searchField = ['tenHocKy', 'maKeHoach'];
        const searchQuery = searchField
          .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'khgd.' + e + ' LIKE :search'))
          .join(' OR ');
        const nganhDaoTaoQuery = CTNganhDaoTao ? { nganhDaoTao: CTNganhDaoTao } : {};
        const query = this.keHoachGiangDayRepository
          .createQueryBuilder('khgd')
          .leftJoinAndSelect('khgd.createdBy', 'createdBy')
          .leftJoinAndSelect('khgd.updatedBy', 'updatedBy')
          .innerJoinAndSelect('khgd.nganhDaoTao', 'ctndt', 'ctndt.isDeleted = false')
          .where((qb) => {
            qb.innerJoinAndSelect('ctndt.nganhDaoTao', 'ndt', 'ndt.isDeleted = false').where((qb) => {
              qb.innerJoin('ndt.chuongTrinhDaoTao', 'ctdt', 'ctdt.isDeleted = false');
              qb.where({ ...nganhDaoTaoQuery, ...otherParam, isDeleted: false });
            });
            searchKey
              ? qb.andWhere('( ' + searchQuery + ' )', {
                  search: `%${searchKey}%`
                })
              : {};
            isSortFieldInForeignKey
              ? qb.orderBy(sortBy, sortType)
              : qb.orderBy(sortBy ? `khgd.${sortBy}` : null, sortType);
          })
          .skip(skip)
          .take(Number(limit) === -1 ? null : Number(limit));
        const [list, total] = await query.getManyAndCount();
        result = { contents: list, total, page: Number(page) };
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_KHGD_CACHE_TTL);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.keHoachGiangDayRepository
        .createQueryBuilder('khgd')
        .leftJoinAndSelect('khgd.createdBy', 'createdBy')
        .leftJoinAndSelect('khgd.updatedBy', 'updatedBy')
        .innerJoinAndSelect('khgd.nganhDaoTao', 'ctndt', 'ctndt.isDeleted = false')
        .where((qb) => {
          qb.innerJoinAndSelect('ctndt.nganhDaoTao', 'nganhDaoTao', 'nganhDaoTao.isDeleted = false').where((qb) => {
            qb.innerJoin('nganhDaoTao.chuongTrinhDaoTao', 'ctdt', 'ctdt.isDeleted = false');
          });
        })
        .andWhere('(khgd.isDeleted = false and khgd.id = :id)', { id })
        .getOne();
      if (!result) {
        throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: CreateKeHoachGiangDayDto): Promise<any> {
    const checkExist = await this.keHoachGiangDayRepository.findOne({
      maKeHoach: newData?.maKeHoach,
      isDeleted: false
    });
    if (checkExist) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_MESSAGE_MAKEHOACH_CONFLIC, HttpStatus.CONFLICT);
    }

    const hocKyKH = await this.keHoachGiangDayRepository.findOne({
      tenHocKy: newData?.tenHocKy,
      nganhDaoTao: newData?.nganhDaoTao,
      isDeleted: false
    });
    if (hocKyKH) {
      throw new ConflictException('Học kỳ đã tồn tại với khóa tuyển này');
    }

    const record = await this.chiTietNganhDaoTaoService.findById(newData.nganhDaoTao);
    if (!record) {
      throw new BadRequestException(KEHOACHGIANGDAY_MESSAGE.CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND);
    }
    try {
      const newKeHoachGiangDay = await this.keHoachGiangDayRepository.create(newData);
      const result = await this.keHoachGiangDayRepository.save(newKeHoachGiangDay);
      const key = format(REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_KEY, result?.id.toString());
      const detail = await this.findById(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: UpdateKeHoachGiangDayDto): Promise<any> {
    const keHoachGiangDay = await this.keHoachGiangDayRepository.findOne({ id, isDeleted: false });
    if (!keHoachGiangDay) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    const record = await this.chiTietNganhDaoTaoService.findById(updatedData.nganhDaoTao);
    if (!record) {
      throw new BadRequestException(KEHOACHGIANGDAY_MESSAGE.CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND);
    }
    try {
      const updated = await this.keHoachGiangDayRepository.save({
        ...keHoachGiangDay,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findById(updated.id);
      await this.delCacheAfterChange();
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const keHoachGiangDay = await this.keHoachGiangDayRepository.findOne({ id, isDeleted: false });
    if (!keHoachGiangDay) {
      throw new HttpException(KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.keHoachGiangDayRepository.save({
        ...keHoachGiangDay,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_KHGD_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.keHoachGiangDayRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_KHGD_CACHE_COMMON_KEY]);
  }
}
