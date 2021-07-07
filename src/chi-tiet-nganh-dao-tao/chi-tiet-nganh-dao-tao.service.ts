import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CTNGANHDAOTAO_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Not, Repository } from 'typeorm';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { IChiTietNganhDaoTao } from './interfaces/chiTietNganhDaoTao.interface';
import { FilterIsExistChiTietCTDT } from './dto/filter-exist-CTNganhDaoTao.dto';
import { FilterCTNganhDaoTaoDto } from './dto/filterCTNganhDaoTao.dto';

@Injectable()
export class ChiTietNganhDaoTaoService {
  constructor(
    @InjectRepository(ChiTietNganhDaoTaoEntity)
    private readonly chiTietNganhDTRepository: Repository<ChiTietNganhDaoTaoEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async isExist(filter: FilterIsExistChiTietCTDT) {
    const { khoa, idNganhDaoTao } = filter;
    if (isNaN(Number(khoa))) {
      throw new BadRequestException('KHOA_IS_NUMBER');
    }
    const checkExistData = await this.chiTietNganhDTRepository.findOne({
      khoa: Number(khoa),
      nganhDaoTao: idNganhDaoTao,
      isDeleted: false
    });
    return checkExistData ? checkExistData : null;
  }

  async findAll(filter: FilterCTNganhDaoTaoDto): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_CHI_TIET_NDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, khoa, nganhDaoTao } = filter;
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const searchField = ['id', 'khoa', 'tongTinChi', 'coHoiNgheNghiep', 'mucTieuChung'];
      const searchQuery = searchField
        .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'ctndt.' + e + ' LIKE :search'))
        .join(' OR ');
      const query = await this.chiTietNganhDTRepository
        .createQueryBuilder('ctndt')
        .innerJoinAndSelect('ctndt.nganhDaoTao', 'nganhDaoTao', 'nganhDaoTao.isDeleted = false')
        .leftJoinAndSelect('ctndt.createdBy', 'createdBy')
        .leftJoinAndSelect('ctndt.updatedBy', 'updatedBy')
        .where((qb) => {
          qb.innerJoinAndSelect(
            'nganhDaoTao.chuongTrinhDaoTao',
            'chuongTrinhDaoTao',
            'chuongTrinhDaoTao.isDeleted = false'
          );
          searchKey
            ? qb.andWhere(`(${searchQuery})`, {
                search: `%${searchKey}%`
              })
            : {};
          khoa ? qb.andWhere('ctndt.khoa = :khoa', { khoa }) : {};
          nganhDaoTao ? qb.andWhere('ctndt.nganhDaoTao =:nganhDaoTao', { nganhDaoTao }) : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `ctndt.${sortBy}` : null, sortType);
        })
        .andWhere('ctndt.isDeleted = false')
        .skip(skip)
        .take(Number(limit) === -1 ? null : Number(limit));
      const [list, total] = await query.getManyAndCount();
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CHI_TIET_NDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.chiTietNganhDTRepository
        .createQueryBuilder('ctndt')
        .innerJoinAndSelect('ctndt.nganhDaoTao', 'nganhDaoTao', 'nganhDaoTao.isDeleted = false')
        .leftJoinAndSelect('ctndt.createdBy', 'createdBy')
        .leftJoinAndSelect('ctndt.updatedBy', 'updatedBy')
        .where((qb) => {
          qb.innerJoinAndSelect(
            'nganhDaoTao.chuongTrinhDaoTao',
            'chuongTrinhDaoTao',
            'chuongTrinhDaoTao.isDeleted = false'
          );
        })
        .andWhere('(ctndt.id = :id and ctndt.isDeleted = false)', { id })
        .getOne();
      if (!result) {
        throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: IChiTietNganhDaoTao): Promise<any> {
    const checkExistData = await this.chiTietNganhDTRepository.findOne({
      khoa: newData?.khoa,
      nganhDaoTao: newData.nganhDaoTao,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newCTNganhDaoTao = await this.chiTietNganhDTRepository.create(newData);
      const result = await this.chiTietNganhDTRepository.save(newCTNganhDaoTao);
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_KEY, result?.id.toString());
      const detail = await this.findById(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND);
      }
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: IChiTietNganhDaoTao): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    const { khoa, nganhDaoTao } = { ...cTNganhDaoTao, ...updatedData };
    const checkExistData = await this.chiTietNganhDTRepository.findOne({
      khoa,
      nganhDaoTao,
      isDeleted: false,
      id: Not(id)
    });
    if (checkExistData) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EXIST, HttpStatus.CONFLICT);
    }

    try {
      const updated = await this.chiTietNganhDTRepository.save({
        ...cTNganhDaoTao,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findById(updated.id);
      await this.delCacheAfterChange();
      return updated;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND);
      }
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chiTietNganhDTRepository.save({
        ...cTNganhDaoTao,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chiTietNganhDTRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_CHI_TIET_NDT_CACHE_COMMON_KEY]);
  }
}
