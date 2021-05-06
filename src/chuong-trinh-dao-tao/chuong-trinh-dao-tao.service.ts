import { HttpStatus, Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUONGTRINHDAOTAO_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { FilterIsExistCTDT } from './dto/filter-is-exist-chuong-trinh-dao-tao.dto';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';
import { IChuongTrinhDaoTao } from './interfaces/chuongTrinhDaoTao.interface';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class ChuongTrinhDaoTaoService {
  constructor(
    @InjectRepository(ChuongTrinhDaoTaoEntity) private chuongTrinhDaoTaoRepository: Repository<ChuongTrinhDaoTaoEntity>,
    private cacheManager: RedisCacheService
  ) {}
  async findAll(filter): Promise<ChuongTrinhDaoTaoEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_CTDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit = LIMIT, page = 0, search = '', updatedAt, ...rest } = filter;
      const skip = Number(page) * Number(limit);
      const querySearch = search ? { ten: Like(`%${search}%`) } : {};
      const orderByUpdateAt = updatedAt ? { updatedAt: updatedAt } : {};
      const query = {
        isDeleted: false,
        ...querySearch,
        ...rest
      };
      const list = await this.chuongTrinhDaoTaoRepository.find({
        where: query,
        skip,
        take: Number(limit),
        order: { ...orderByUpdateAt }
      });
      if (!list.length) {
        throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_EMPTY, HttpStatus.NOT_FOUND);
      }
      const total = await this.chuongTrinhDaoTaoRepository.count(query);
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CTDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async findById(id: number): Promise<ChuongTrinhDaoTaoEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.chuongTrinhDaoTaoRepository.findOne({ id, isDeleted: false });
      if (!result) {
        throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async create(newData: IChuongTrinhDaoTao): Promise<any> {
    const checkExistName = await this.chuongTrinhDaoTaoRepository.findOne({
      where: [
        { ten: newData?.ten, isDeleted: false },
        { maCTDT: newData?.maCTDT, isDeleted: false }
      ]
    });
    if (checkExistName) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_NAME_OR_CODE_EXIST, HttpStatus.CONFLICT);
    }
    try {
      const newChuongTrinhDaoTao = await this.chuongTrinhDaoTaoRepository.create(newData);
      const saved = await this.chuongTrinhDaoTaoRepository.save(newChuongTrinhDaoTao);
      return saved;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async update(id: number, updatedData: IChuongTrinhDaoTao): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ id, isDeleted: false });
    if (!chuongtrinhdaotao) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const updated = await this.chuongTrinhDaoTaoRepository.save({
        ...chuongtrinhdaotao,
        ...updatedData,
        updatedAt: new Date()
      });
      return updated;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete(id: number, updatedBy?: number): Promise<any> {
    const chuongtrinhdaotao = await this.chuongTrinhDaoTaoRepository.findOne({ id, isDeleted: false });
    if (!chuongtrinhdaotao) {
      throw new HttpException(CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    try {
      const deleted = await this.chuongTrinhDaoTaoRepository.save({
        ...chuongtrinhdaotao,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      return deleted;
    } catch (error) {
      throw new HttpException(error?.message || 'error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getCountCTDT(): Promise<number> {
    return await this.chuongTrinhDaoTaoRepository.count({ isDeleted: false });
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chuongTrinhDaoTaoRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_FAILED);
    }
  }
  async isExist(filter: FilterIsExistCTDT) {
    try {
      const { ten = '', maCTDT = '' } = filter;
      if (ten || maCTDT) {
        const foundTen = ten
          ? await this.chuongTrinhDaoTaoRepository.findOne({
              where: [{ ten: ten, isDeleted: false }]
            })
          : null;
        const foundMa = maCTDT
          ? await this.chuongTrinhDaoTaoRepository.findOne({
              where: [{ maCTDT: maCTDT, isDeleted: false }]
            })
          : null;
        let result = '';
        if (foundTen) {
          result += '_TEN';
        }
        if (foundMa) {
          result += '_MA';
        }
        return result ? 'CONFLICT' + result : null;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
