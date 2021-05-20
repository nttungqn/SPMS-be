import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, MONHOC_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { In, Like, Not, Repository } from 'typeorm';
import { CreateMonHocDto } from './dto/create-mon-hoc.dto';
import { MonHocEntity } from './entity/mon-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { Connection, getConnection, createConnection } from 'typeorm';
@Injectable()
export class MonHocService {
  constructor(
    @InjectRepository(MonHocEntity) private monHocRepository: Repository<MonHocEntity>,
    private cacheManager: RedisCacheService,
    private connection: Connection
  ) {}

  async findAll(filter): Promise<MonHocEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_MON_HOC_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, ...otherParam } = filter;
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const searchField = [
        'id',
        'ma',
        'tenTiengViet',
        'tenTiengAnh',
        'soTietLyThuyet',
        'soTietThucHanh',
        'soTietTuHoc'
      ];
      const searchQuery = searchField
        .map((e) => (e.includes('.') ? e + ' LIKE :search' : 'mh.' + e + ' LIKE :search'))
        .join(' OR ');
      const [list, total] = await this.monHocRepository
        .createQueryBuilder('mh')
        .leftJoinAndSelect('mh.createdBy', 'createdBy')
        .leftJoinAndSelect('mh.updatedBy', 'updatedBy')
        .where((qb) => {
          searchKey
            ? qb.andWhere(searchQuery, {
                search: `%${searchKey}%`
              })
            : {};
          isSortFieldInForeignKey ? qb.orderBy(sortBy, sortType) : qb.orderBy(sortBy ? `mh.${sortBy}` : null, sortType);
        })
        .andWhere({ isDeleted: false, ...otherParam })
        .skip(skip)
        .take(limit)
        .getManyAndCount();
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_MON_HOC_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<MonHocEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.monHocRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['createdBy', 'updatedBy']
      });
      if (!result) {
        throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: MonHocEntity): Promise<any> {
    const checkExistName = await this.monHocRepository.findOne({ ma: newData?.ma, isDeleted: false });
    if (checkExistName) {
      throw new ConflictException(MONHOC_MESSAGE.MONHOC_EXIST);
    }
    try {
      const monhoc = await this.monHocRepository.create(newData);
      const result = await this.monHocRepository.save(monhoc);
      const key = format(REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_KEY, result?.id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.CREATE_MONHOC_FAILED);
    }
  }

  async update(id: number, updatedData: MonHocEntity): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ id, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
    }

    if (await this.isExist(monhoc, updatedData)) {
      throw new ConflictException(MONHOC_MESSAGE.MONHOC_EXIST);
    }

    try {
      const result = await this.monHocRepository.save({
        ...monhoc,
        ...updatedData,
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_KEY, id.toString());
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.UPDATE_MONHOC_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const monhoc = await this.monHocRepository.findOne({ id, isDeleted: false });
    if (!monhoc) {
      throw new NotFoundException(MONHOC_MESSAGE.MONHOC_ID_NOT_FOUND);
    }
    try {
      const result = await this.monHocRepository.save({
        ...monhoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MONHOC_MESSAGE.DELETE_MONHOC_FAILED);
    }
  }
  async checkFormatFile(headers = [], test = []) {
    if (!headers?.length || !test?.length) {
      return { message: MONHOC_MESSAGE.IMPORT_INPUT_INVALID, isError: true };
    }
    for (let index = 0; index < headers.length; index++) {
      const header = headers[index] || '';
      const dataTest = test[index] || '';
      if (header?.toUpperCase() !== dataTest?.toUpperCase()) {
        return { message: MONHOC_MESSAGE.IMPORT_INPUT_INVALID, isError: true };
      }
    }
    return { isError: false };
  }

  async insertMonHoc(data = [], user): Promise<any> {
    if (!data?.length) {
      throw new BadRequestException();
    }
    const extractSubjectCode = data.map((item) => item[0] || '');
    const isDuplicate = await this.getListSubjectDuplicate(extractSubjectCode);
    if (isDuplicate.length) {
      return { message: 'DUPLICATE_LIST', isError: true, list: isDuplicate };
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const resultsArr = data?.map(async (e) => {
        const ma = e[0] || null;
        const tenTiengViet = e[1] || null;
        const soTinChi = e[2] || 0;
        const soTietLyThuyet = e[3] || 0;
        const soTietThucHanh = e[4] || 0;
        const soTietTuHoc = e[5] || 0;
        const newMonHoc = await queryRunner.manager.getRepository(MonHocEntity).create({
          ma,
          tenTiengViet,
          soTinChi,
          soTietLyThuyet,
          soTietThucHanh,
          soTietTuHoc,
          tenTiengAnh: '',
          createdBy: user?.id,
          updatedBy: user?.id
        });
        const result = await queryRunner.manager.getRepository(MonHocEntity).save(newMonHoc);
        console.log('🚀 ~ file: mon-hoc.service.ts ~ line 189 ~ MonHocService ~ resultsArr ~ result', result);
      });
      await Promise.all(resultsArr);
      console.log('transaction successfully.');
      await queryRunner.commitTransaction();
      return { message: MONHOC_MESSAGE.IMPORT_SUCCESSFULLY, isError: false };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      console.log('ERROR, transaction ended');
      return { message: MONHOC_MESSAGE.IMPORT_FAILED, isError: true, error: error?.sqlMessage };
    } finally {
      await queryRunner.release();
    }
  }
  async getAllSubjectByNganhDaoTaoAndKhoaTuyen(idNganhDaoTao: number, khoaTuyen: number) {
    const key = format(REDIS_CACHE_VARS.LIST_MH_NDT_KT_CACHE_KEY, idNganhDaoTao.toString(), khoaTuyen.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.monHocRepository
        .createQueryBuilder('mh')
        .leftJoinAndSelect('mh.chiTietGomNhom', 'chiTietGomNhom')
        .where((qb) => {
          qb.leftJoin('chiTietGomNhom.gomNhom', 'gomNhom')
            .where((qb) => {
              qb.leftJoin('gomNhom.loaiKhoiKienThuc', 'loaiKhoiKienThuc')
                .where((qb) => {
                  qb.leftJoin('loaiKhoiKienThuc.khoiKienThuc', 'khoiKienThuc')
                    .where((qb) => {
                      qb.leftJoin('khoiKienThuc.chiTietNganh', 'chiTietNganh')
                        .where(`chiTietNganh.khoa = ${khoaTuyen}`)
                        .andWhere(`chiTietNganh.nganhDaoTao = ${idNganhDaoTao}`)
                        .andWhere(`chiTietNganh.isDeleted = ${false}`);
                    })
                    .andWhere(`khoiKienThuc.isDeleted = ${false}`);
                })
                .andWhere(`loaiKhoiKienThuc.isDeleted = ${false}`);
            })
            .andWhere(`chiTietGomNhom.isDeleted = ${false}`);
        })
        .getMany();
      if (result.length === 0) {
        throw new BadRequestException(`KHOA_${khoaTuyen}_MONHOC_EMPTY`);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_MH_NDT_KT_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async isExist(oldData: MonHocEntity, newData: CreateMonHocDto): Promise<boolean> {
    if (!newData.ma) return false;
    const ma = newData.ma ? newData.ma : oldData.ma;
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMa = { ma };
    const query = {
      isDeleted: false,
      ...queryByMa,
      ...notID
    };
    const result = await this.monHocRepository.findOne({ where: query });
    return result ? true : false;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.monHocRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(MONHOC_MESSAGE.DELETE_MONHOC_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([
      REDIS_CACHE_VARS.LIST_MON_HOC_CACHE_COMMON_KEY,
      REDIS_CACHE_VARS.LIST_MH_NDT_KT_CACHE_COMMON_KEY
    ]);
  }

  async getListSubjectDuplicate(listSubjectCode) {
    const list = await this.monHocRepository.find({
      where: {
        ma: In(listSubjectCode)
      },
      select: ['ma']
    });
    return list;
  }
}
