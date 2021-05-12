import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { CHUANDAURA_NGANHDAOTAO_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm/repository/Repository';
import { CreateChuanDauRaNganhDaoTaoDto } from './dto/createChuanDauRaNDT.dto';
import { ChuanDauRaNganhDaoTaoEntity } from './entity/chuanDauRaNganhDaoTao.entity';
const LTT = require('list-to-tree');

@Injectable()
export class ChuanDauRaNganhDaoTaoService {
  constructor(
    @InjectRepository(ChuanDauRaNganhDaoTaoEntity)
    private readonly chuanDauRaNDTRepository: Repository<ChuanDauRaNganhDaoTaoEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter: any): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_CDRNDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit = LIMIT, page = 0, ...rest } = filter;
      const skip = Number(page) * Number(limit);
      const query = {
        isDeleted: false,
        ...rest
      };
      const list = await this.chuanDauRaNDTRepository.find({
        relations: ['parent', 'nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy'],
        skip,
        take: limit,
        where: query
      });
      if (!list.length) {
        throw new HttpException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      }
      const total = await this.chuanDauRaNDTRepository.count({ ...query });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CDRNDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.chuanDauRaNDTRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy']
      });
      if (!result) {
        throw new HttpException(
          CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: CreateChuanDauRaNganhDaoTaoDto): Promise<any> {
    const checkExistData = await this.chuanDauRaNDTRepository.findOne({
      ma: newData?.ma,
      nganhDaoTao: newData?.nganhDaoTao,
      chuanDauRa: newData?.chuanDauRa,
      isDeleted: false
    });
    if (checkExistData) {
      throw new HttpException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_IS_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuanDauRaNDT = await this.chuanDauRaNDTRepository.create(newData);
      const result = await this.chuanDauRaNDTRepository.save(newChuanDauRaNDT);
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatedData: CreateChuanDauRaNganhDaoTaoDto): Promise<any> {
    const chuanDauRaNDT = await this.chuanDauRaNDTRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRaNDT) {
      throw new HttpException(
        CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const updated = await this.chuanDauRaNDTRepository.save({
        ...chuanDauRaNDT,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_KEY, id.toString());
      await this.cacheManager.set(key, updated, REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_TTL);
      await this.delCacheAfterChange();
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chuanDauRaNDT = await this.chuanDauRaNDTRepository.findOne({ id, isDeleted: false });
    if (!chuanDauRaNDT) {
      throw new HttpException(
        CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND,
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const deleted = await this.chuanDauRaNDTRepository.save({
        ...chuanDauRaNDT,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRNDT_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllList(idCTNDT: number): Promise<any> {
    const key = format(REDIS_CACHE_VARS.LIST_CDRNDT_NDT_CACHE_KEY, idCTNDT.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      try {
        const list = await this.chuanDauRaNDTRepository.find({
          where: { isDeleted: false, nganhDaoTao: idCTNDT },
          relations: ['parent', 'nganhDaoTao', 'chuanDauRa', 'createdBy', 'updatedBy']
        });
        const tmp = list.map((x) => {
          if (x.parent == null) x.parent = 0;
          else x.parent = x.parent['id'];
          return x;
        });
        const ltt = new LTT(tmp, {
          key_id: 'id',
          key_parent: 'parent'
        });
        result = ltt.GetTree();
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CDRNDT_NDT_CACHE_TTL);
      } catch (error) {
        throw new InternalServerErrorException(CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY);
      }
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chuanDauRaNDTRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHUANDAURA_NGANHDAOTAO_MESSAGE.DELETE_CHUANDAURA_NGANHDAOTAO_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([
      REDIS_CACHE_VARS.LIST_CDRNDT_CACHE_COMMON_KEY,
      REDIS_CACHE_VARS.LIST_CTGN_MHTT_CACHE_COMMON_KEY,
      REDIS_CACHE_VARS.LIST_CTGN_SJ_CACHE_COMMON_KEY
    ]);
  }
}
