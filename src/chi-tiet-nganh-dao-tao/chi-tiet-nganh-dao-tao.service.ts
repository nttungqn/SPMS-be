import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CTNGANHDAOTAO_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm';
import { FilterCTNganhDaoTaoDto } from './dto/filterCTNganhDaoTao.dto';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { IChiTietNganhDaoTao } from './interfaces/chiTietNganhDaoTao.interface';

@Injectable()
export class ChiTietNganhDaoTaoService {
  constructor(
    @InjectRepository(ChiTietNganhDaoTaoEntity)
    private readonly chiTietNganhDTRepository: Repository<ChiTietNganhDaoTaoEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: FilterCTNganhDaoTaoDto): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_CHI_TIET_NDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit = LIMIT, page = 0, ...rest } = filter;
      const skip = Number(page) * Number(limit);
      const query = {
        isDeleted: false,
        ...rest
      };
      const list = await this.chiTietNganhDTRepository.find({
        relations: ['nganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao'],
        skip,
        take: limit,
        where: query
      });
      if (!list.length) {
        throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      }
      const total = await this.chiTietNganhDTRepository.count({ ...query });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CHI_TIET_NDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_NDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.chiTietNganhDTRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['nganhDaoTao', 'createdBy', 'updatedBy', 'nganhDaoTao.chuongTrinhDaoTao']
      });
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
      const saved = await this.chiTietNganhDTRepository.save(newCTNganhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: IChiTietNganhDaoTao): Promise<any> {
    const cTNganhDaoTao = await this.chiTietNganhDTRepository.findOne({ id, isDeleted: false });
    if (!cTNganhDaoTao) {
      throw new HttpException(CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chiTietNganhDTRepository.save({
        ...cTNganhDaoTao,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
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
}
