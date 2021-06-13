import { HttpStatus, Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUONGTRINHDAOTAO_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Repository } from 'typeorm';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';
import { IChuongTrinhDaoTao } from './interfaces/chuongTrinhDaoTao.interface';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { FilterIsExistCTDT } from './dto/filter-is-exist-chuong-trinh-dao-tao.dto';
import { Connection, getConnection, createConnection } from 'typeorm';
import { NganhDaoTaoEntity } from 'ctdt/entity/nganhDaoTao.entity';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import * as lodash from 'lodash';

@Injectable()
export class ChuongTrinhDaoTaoService {
  constructor(
    @InjectRepository(ChuongTrinhDaoTaoEntity) private chuongTrinhDaoTaoRepository: Repository<ChuongTrinhDaoTaoEntity>,
    private cacheManager: RedisCacheService,
    private connection: Connection
  ) {}
  async findAll(filter): Promise<ChuongTrinhDaoTaoEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_CTDT_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, updatedAt, ...otherParam } = filter;
      const finalSortType = updatedAt ? updatedAt : sortType ? sortType : 'ASC';
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const searchField = [
        'id',
        'maCTDT',
        'loaiHinh',
        'trinhDo',
        'dieuKienTotNghiep',
        'ten',
        'doiTuong',
        'quiTrinhDaoTao'
      ];
      const searchQuery = searchField
        .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'ctdt.' + e + ' LIKE :search'))
        .join(' OR ');
      const [list, total] = await this.chuongTrinhDaoTaoRepository
        .createQueryBuilder('ctdt')
        .leftJoinAndSelect('ctdt.createdBy', 'createdBy')
        .leftJoinAndSelect('ctdt.updatedBy', 'updatedBy')
        .where((qb) => {
          searchKey
            ? qb.andWhere(searchQuery, {
                search: `%${searchKey}%`
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, finalSortType)
            : qb.orderBy(sortBy ? `ctdt.${sortBy}` : null, finalSortType);
        })
        .andWhere({ ...otherParam, isDeleted: false })
        .skip(skip)
        .take(Number(limit) === -1 ? null: Number(limit))
        .getManyAndCount();
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CTDT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async findById(id: number): Promise<ChuongTrinhDaoTaoEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
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
      const result = await this.chuongTrinhDaoTaoRepository.save(newChuongTrinhDaoTao);
      const key = format(REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_KEY, result?.id.toString());
      const detail = await this.findById(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
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
      const key = format(REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findById(updated.id);
      await this.delCacheAfterChange();
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
      const key = format(REDIS_CACHE_VARS.DETAIL_CTDT_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
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

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_CTDT_CACHE_COMMON_KEY]);
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

  async createDetail(newData, user): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ctdtRepo = await queryRunner.manager.getRepository(ChuongTrinhDaoTaoEntity);
      const nganhDaoTaoRepo = await queryRunner.manager.getRepository(NganhDaoTaoEntity);
      const ctndtRepo = await queryRunner.manager.getRepository(ChiTietNganhDaoTaoEntity);
      const isCTDTExist = await ctdtRepo.findOne({
        where: [
          { ten: newData?.ten, isDeleted: false },
          { maCTDT: newData?.maCTDT, isDeleted: false }
        ]
      });
      if (isCTDTExist) {
        return { message: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_NAME_OR_CODE_EXIST, isError: true };
      }

      const newCTDT = await ctdtRepo.create({
        maCTDT: newData?.maCTDT,
        loaiHinh: newData?.loaiHinh,
        ten: newData?.ten,
        trinhDo: newData?.trinhDo,
        doiTuong: newData?.doiTuong,
        quiTrinhDaoTao: newData?.quiTrinhDaoTao,
        dieuKienTotNghiep: newData?.dieuKienTotNghiep,
        createdBy: user?.id,
        updatedBy: user?.id
      });
      const ctdt = await ctdtRepo.save(newCTDT);

      const listNDT = newData?.payload || [];
      const listNDTSaved = [];
      for (const ndt of listNDT) {
        if (ndt?.maNganhDaoTao && ndt?.ten) {
          const newNDT = await nganhDaoTaoRepo.create({
            maNganhDaoTao: ndt?.maNganhDaoTao,
            ten: ndt?.ten,
            chuongTrinhDaoTao: ctdt?.id,
            createdBy: user?.id,
            updatedBy: user?.id
          });

          const ndtSaved = await nganhDaoTaoRepo.save(newNDT);

          if (ndt?.khoa) {
            const newCTNDT = await ctndtRepo.create({
              khoa: ndt?.khoa,
              coHoiNgheNghiep: ndt?.coHoiNgheNghiep,
              mucTieuChung: ndt?.mucTieuChung,
              nganhDaoTao: ndtSaved?.id,
              createdBy: user?.id,
              updatedBy: user?.id
            });

            const ctndtSaved = await ctndtRepo.save(newCTNDT);
            listNDTSaved.push({ ndt: ndtSaved, ctndt: ctndtSaved });
          }
          listNDTSaved.push({ ndt: ndtSaved, ctndt: null });
        }
      }

      await queryRunner.commitTransaction();
      return {
        message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY,
        isError: false,
        data: { ctdt, ndtsaved: listNDTSaved }
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED,
        isError: false,
        error: lodash.get(error, 'sqlMessage', 'error')
      };
    } finally {
      console.log('Transaction ended');
      await queryRunner.release();
    }
  }
}
