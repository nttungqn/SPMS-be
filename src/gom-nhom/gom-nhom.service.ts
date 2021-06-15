import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GOMNHOM_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { LoaiKhoiKienThucService } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.service';
import { Like, Repository } from 'typeorm';
import { GomNhomEntity } from './entity/gom-nhom.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class GomNhomService {
  constructor(
    @InjectRepository(GomNhomEntity) private gomNhomRepository: Repository<GomNhomEntity>,
    private loaiKhoiKienThucService: LoaiKhoiKienThucService,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter): Promise<GomNhomEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_GOM_NHOM_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, search = '', sortBy = '', sortType = 'ASC', ...otherParam } = filter;
      const skip = Number(page) * Number(limit);
      const query = {
        isDeleted: false,
        ...otherParam
      };

      let sortByTemp = sortBy;
      if (sortByTemp != 'idLKKT.ten' && sortByTemp != '') sortByTemp = 'gn.' + sortByTemp;

      try {
        const queryBuilder = this.gomNhomRepository
          .createQueryBuilder('gn')
          .leftJoinAndSelect('gn.idLKKT', 'idLKKT')
          .leftJoinAndSelect('gn.createdBy', 'createdBy')
          .leftJoinAndSelect('gn.updatedBy', 'updatedBy')
          .leftJoinAndSelect('gn.chiTietGomNhom', 'chiTietGomNhom')
          .where((qb) => {
            qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
            qb.leftJoinAndSelect(
              'gn.loaiKhoiKienThuc',
              'loaiKhoiKienThuc',
              `loaiKhoiKienThuc.isDeleted = ${false}`
            ).where((qb) => {
              qb.leftJoinAndSelect(
                'loaiKhoiKienThuc.khoiKienThuc',
                'khoiKienThuc',
                `khoiKienThuc.isDeleted = ${false}`
              ).where((qb) => {
                qb.leftJoinAndSelect(
                  'khoiKienThuc.chiTietNganh',
                  'chiTietNganh',
                  `chiTietNganh.isDeleted = ${false}`
                ).where((qb) => {
                  qb.leftJoinAndSelect('chiTietNganh.nganhDaoTao', 'nganhDaoTao', `nganhDaoTao.isDeleted = ${false}`);
                });
              });
            });
          })
          .andWhere(query);

        if (search != '') {
          queryBuilder.andWhere(
            'idLKKT.ten LIKE :search OR gn.maGN LIKE :search OR gn.stt LIKE :search OR gn.soTCBB LIKE :search OR gn.loaiNhom LIKE :search OR gn.tieuDe LIKE :search',
            { search: `%${search}%` }
          );
        }

        const [list, total] = await queryBuilder
          .orderBy(sortByTemp, sortType)
          .skip(skip)
          .take(Number(limit) === -1 ? null : Number(limit))
          .getManyAndCount();
        result = { contents: list, total, page: Number(page) };
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_GOM_NHOM_CACHE_TTL);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<GomNhomEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.gomNhomRepository
        .createQueryBuilder('gn')
        .leftJoinAndSelect('gn.idLKKT', 'idLKKT')
        .leftJoinAndSelect('gn.createdBy', 'createdBy')
        .leftJoinAndSelect('gn.updatedBy', 'updatedBy')
        .leftJoinAndSelect('gn.chiTietGomNhom', 'chiTietGomNhom')
        .where((qb) => {
          qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
          qb.leftJoinAndSelect(
            'gn.loaiKhoiKienThuc',
            'loaiKhoiKienThuc',
            `loaiKhoiKienThuc.isDeleted = ${false}`
          ).where((qb) => {
            qb.leftJoinAndSelect(
              'loaiKhoiKienThuc.khoiKienThuc',
              'khoiKienThuc',
              `khoiKienThuc.isDeleted = ${false}`
            ).where((qb) => {
              qb.leftJoinAndSelect(
                'khoiKienThuc.chiTietNganh',
                'chiTietNganh',
                `chiTietNganh.isDeleted = ${false}`
              ).where((qb) => {
                qb.leftJoinAndSelect('chiTietNganh.nganhDaoTao', 'nganhDaoTao', `nganhDaoTao.isDeleted = ${false}`);
              });
            });
          });
        })
        .andWhere(`gn.id = ${id}`)
        .andWhere(`gn.isDeleted = ${false}`)
        .getOne();
      if (!result) {
        throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: GomNhomEntity): Promise<any> {
    const checkExistName = await this.gomNhomRepository.findOne({ maGN: newData?.maGN, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_EXIST);
    }
    const record = await this.loaiKhoiKienThucService.findOne(newData.idLKKT);
    if (!record) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_FOREIGN_KEY_CONFLICT);
    }
    try {
      const gomNhom = await this.gomNhomRepository.create(newData);
      const result = await this.gomNhomRepository.save(gomNhom);
      const key = format(REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_KEY, result?.id.toString());
      const detail = await this.findById(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.CREATE_GOMNHOM_FAILED);
    }
  }

  async update(id: number, updatedData: GomNhomEntity): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }

    // check Ma is exist
    const chuDeByMa = await this.gomNhomRepository.findOne({ maGN: updatedData.maGN, isDeleted: false });
    if (chuDeByMa) {
      throw new ConflictException(GOMNHOM_MESSAGE.GOMNHOM_EXIST);
    }

    try {
      const result = await this.gomNhomRepository.save({
        ...gomNhom,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findById(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.UPDATE_GOMNHOM_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const gomNhom = await this.gomNhomRepository.findOne({ id, isDeleted: false });
    if (!gomNhom) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }
    try {
      const result = await this.gomNhomRepository.save({
        ...gomNhom,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_GOM_NHOM_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }
  async findAllWithSelectField(filter): Promise<GomNhomEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', select = '', ...otherParam } = filter;
    const querySearch = search ? { tieuDe: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    try {
      const results = await this.gomNhomRepository.find({
        where: query,
        relations: select ? select?.split(',') : []
      });
      return results;
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async deleteMultipleRows(ids: string, updatedBy?: number): Promise<any> {
    const list_id = ids
      .trim()
      .split(',')
      .map((x) => +x);
    const records = await this.gomNhomRepository
      .createQueryBuilder('gn')
      .where('gn.id IN (:...ids)', { ids: list_id })
      .andWhere(`gn.isDeleted = ${false}`)
      .getCount();
    if (list_id.length != records) {
      throw new NotFoundException(GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND);
    }

    try {
      await this.gomNhomRepository
        .createQueryBuilder('gn')
        .update(GomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .andWhere('id IN (:...ids)', { ids: list_id })
        .execute();
      await this.delCacheAfterChange();
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async deleteAll(updatedBy?: number): Promise<any> {
    try {
      await this.gomNhomRepository
        .createQueryBuilder('gn')
        .update(GomNhomEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .where(`isDeleted = ${false}`)
        .execute();
      await this.delCacheAfterChange();
    } catch (error) {
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.gomNhomRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_GOM_NHOM_CACHE_COMMON_KEY]);
  }
}
