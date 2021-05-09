import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KHOIKIENTHUC_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietNganhDaoTaoService } from '../chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { filterKnowledgeBlock } from './dto/filter-khoi-kien-thuc.dto';
import { KhoiKienThucEntity } from './entity/khoi-kien-thuc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class KhoiKienThucService {
  constructor(
    @InjectRepository(KhoiKienThucEntity)
    private knowledgeBlockRepository: Repository<KhoiKienThucEntity>,
    private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService,
    private cacheManager: RedisCacheService
  ) {}

  async create(knowledgeBlock: KhoiKienThucEntity) {
    const record = await this.chiTietNganhDaoTaoService.findById(knowledgeBlock.chiTietNganh);
    if (!record) {
      throw new ConflictException(KHOIKIENTHUC_MESSAGE.ID_CHI_TIET_NGANH_DAO_TAO);
    }
    const { tinChiBatBuoc = 0, tinChiTuChonTuDo = 0, tinChiTuChon = 0 } = knowledgeBlock;
    knowledgeBlock.tongTinChi = tinChiBatBuoc + tinChiTuChonTuDo + tinChiTuChon;
    try {
      const result = await this.knowledgeBlockRepository.save({
        ...knowledgeBlock,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.CREATE_KHOIKIENTHUC_FAILED);
    }
  }

  async findAll(filter: filterKnowledgeBlock) {
    const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType } = filter;
    const skip = Number(page) * Number(limit);
    const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
    const searchField = ['id', 'tongTinChi', 'ten', 'maKKT', 'tinChiTuChon', 'tinChiTuChonTuDo', 'tinChiBatBuoc'];
    const searchQuery = searchField
      .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'kkt.' + e + ' LIKE :search'))
      .join(' OR ');
    const [list, total] = await this.knowledgeBlockRepository
      .createQueryBuilder('kkt')
      .leftJoinAndSelect('kkt.chiTietNganh', 'chiTietNganh', 'chiTietNganh.isDeleted = false')
      .leftJoinAndSelect('kkt.createdBy', 'createdBy')
      .leftJoinAndSelect('kkt.updatedBy', 'updatedBy')
      .where((qb) => {
        qb.leftJoinAndSelect('chiTietNganh.nganhDaoTao', 'nganhDaoTao');
        searchKey
          ? qb.andWhere(searchQuery, {
              search: `%${searchKey}%`
            })
          : {};
        isSortFieldInForeignKey ? qb.orderBy(sortBy, sortType) : qb.orderBy(sortBy ? `kkt.${sortBy}` : null, sortType);
      })
      .skip(skip)
      .take(limit)
      .andWhere('kkt.isDeleted = false')
      .getManyAndCount();
    return { contents: list, total, page: Number(page) };
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_KKT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.knowledgeBlockRepository.findOne(id, {
        relations: ['chiTietNganh', 'createdBy', 'updatedBy'],
        where: { isDeleted: false }
      });
      if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_KKT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, knowledgeBlock: KhoiKienThucEntity) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
    const { tinChiBatBuoc, tinChiTuChonTuDo, tinChiTuChon } = knowledgeBlock;
    const type: { tinChiBatBuoc: number; tinChiTuChonTuDo: number; tinChiTuChon: number } = {
      tinChiBatBuoc,
      tinChiTuChonTuDo,
      tinChiTuChon
    };
    Object.keys(type).forEach((key) => {
      if (type[key]) result.tongTinChi += type[key] - result[key];
    });
    try {
      await this.knowledgeBlockRepository.save({ ...result, ...knowledgeBlock, updatedAt: new Date() });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.UPDATE_KHOIKIENTHUC_FAILED);
    }
  }

  async remove(idUser: number, id: number) {
    const result = await this.knowledgeBlockRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND);
    try {
      return await this.knowledgeBlockRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.knowledgeBlockRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_FAILED);
    }
  }
}
