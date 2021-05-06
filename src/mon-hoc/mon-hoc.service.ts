import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MONHOC_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { Like, Not, Repository } from 'typeorm';
import { CreateMonHocDto } from './dto/create-mon-hoc.dto';
import { MonHocEntity } from './entity/mon-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class MonHocService {
  constructor(
    @InjectRepository(MonHocEntity) private monHocRepository: Repository<MonHocEntity>,
    private cacheManager: RedisCacheService
  ) {}

  async findAll(filter): Promise<MonHocEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_MON_HOC_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { limit, page = 0, search = '', ...otherParam } = filter;
      const skip = limit ? Number(page) * Number(limit) : null;
      const querySearch = search ? { tenTiengViet: Like(`%${search}%`) } : {};
      const query = {
        isDeleted: false,
        ...querySearch,
        ...otherParam
      };
      const total = await this.monHocRepository.count({ ...query });
      if (!limit && Number(page) > 0) {
        return { contents: [], total, page: Number(page) };
      }
      const list = await this.monHocRepository.find({
        where: query,
        skip,
        take: Number(limit),
        relations: ['createdBy', 'updatedBy']
      });
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_MON_HOC_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findById(id: number): Promise<MonHocEntity | any> {
    const key = format(REDIS_CACHE_VARS.DETAIL_MON_HOC_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
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
      const saved = await this.monHocRepository.save(monhoc);
      return saved;
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
      return await this.monHocRepository.save({
        ...monhoc,
        ...updatedData,
        updatedAt: new Date()
      });
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
      return await this.monHocRepository.save({
        ...monhoc,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
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
  async insertMonHoc(data = [], user) {
    if (!data?.length) {
      throw new BadRequestException();
    }
    try {
      const resultsArr = data?.map(async (e) => {
        const ma = e[0] || '';
        const tenTiengViet = e[1] || '';
        const soTinChi = e[2] || 0;
        const soTietLyThuyet = e[3] || 0;
        const soTietThucHanh = e[4] || 0;
        const soTietTuHoc = e[5] || 0;
        await this.create({
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
      });
      await Promise.all(resultsArr);
      return { message: MONHOC_MESSAGE.IMPORT_SUCCESSFULLY, isError: false };
    } catch (error) {
      return { message: MONHOC_MESSAGE.IMPORT_FAILED, isError: true, error };
    }
  }
  async getAllSubjectByNganhDaoTaoAndKhoaTuyen(idNganhDaoTao: number, khoaTuyen: number) {
    const key = format(REDIS_CACHE_VARS.LIST_MH_NDT_KT_CACHE_KEY, idNganhDaoTao.toString(), khoaTuyen.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
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
}
