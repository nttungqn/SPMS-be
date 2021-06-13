import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, CHITIETKEHOACH_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { Repository } from 'typeorm';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { KeHoachGiangDayService } from 'ke-hoach-giang-day/ke-hoach-giang-day.service';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
import { FilterChiTietKeHoach } from './dto/filter-chi-tiet-ke-hoach.dto';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class ChiTietKeHoachService {
  constructor(
    @InjectRepository(ChiTietKeHoachEntity)
    private chiTietKeHoachRepository: Repository<ChiTietKeHoachEntity>,
    private keHoachGiangDayService: KeHoachGiangDayService,
    private chiTietGomNhomService: ChiTietGomNhomService,
    private cacheManager: RedisCacheService
  ) {}

  async create(newData: ChiTietKeHoachEntity) {
    const ctgn = await this.chiTietGomNhomService.findById(newData.idCTGN);
    const khgd = await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (!(khgd && ctgn)) throw new ConflictException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_CONFLICT);

    try {
      const result = await this.chiTietKeHoachRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_KEY, result?.id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_TTL);
      await this.deleteKeysAfterChange();
      return result;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_NOT_FOUND);
      }
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.CREATE_CHITIETKEHOACH_FAILED);
    }
  }

  async findAll(filter: FilterChiTietKeHoach) {
    const key = format(REDIS_CACHE_VARS.LIST_CHI_TIET_KE_HOACH_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, search = '', sortBy = '', sortType = 'ASC', ...otherParam } = filter;
      const skip = Number(page) * Number(limit);
      const query = {
        isDeleted: false,
        ...otherParam
      };

      let sortByTemp = sortBy;
      if (sortByTemp != 'idKHGD.maKeHoach' && sortByTemp != 'idCTGN.id' && sortByTemp != '')
        sortByTemp = 'ctkhgd.' + sortByTemp;

      try {
        const queryBuilder = this.chiTietKeHoachRepository
          .createQueryBuilder('ctkhgd')
          .leftJoinAndSelect('ctkhgd.createdBy', 'createdBy')
          .leftJoinAndSelect('ctkhgd.updatedBy', 'updatedBy')
          .leftJoinAndSelect('ctkhgd.idCTGN', 'idCTGN')
          .where((qb) => {
            qb.leftJoinAndSelect('idCTGN.gomNhom', 'gomNhom', `idCTGN.isDeleted = ${false}`).leftJoinAndSelect(
              'idCTGN.monHoc',
              'monHoc',
              `gomNhom.isDeleted = ${false}`
            );
            qb.leftJoinAndSelect('ctkhgd.idKHGD', 'khgd', `khgd.isDeleted = ${false}`).where((qb) => {
              qb.leftJoinAndSelect('khgd.nganhDaoTao', 'nganhDaoTao', `nganhDaoTao.isDeleted = ${false}`);
            });
          })
          .where(query);

        if (search != '') {
          queryBuilder.andWhere(
            'idKHGD.maKeHoach LIKE :search OR idCTGN.id LIKE :search OR ctkhgd.ghiChu LIKE :search',
            {
              search: `%${search}%`
            }
          );
        }

        const [list, total] = await queryBuilder.orderBy(sortByTemp, sortType).skip(skip).take(limit).getManyAndCount();
        result = { contents: list, total, page: Number(page) };
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CHI_TIET_KE_HOACH_CACHE_TTL);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.chiTietKeHoachRepository
        .createQueryBuilder('ctkhgd')
        .leftJoinAndSelect('ctkhgd.createdBy', 'createdBy')
        .leftJoinAndSelect('ctkhgd.updatedBy', 'updatedBy')
        .leftJoinAndSelect('ctkhgd.idKHGD', 'idKHGD')
        .leftJoinAndSelect('ctkhgd.idCTGN', 'idCTGN')
        .where((qb) => {
          qb.leftJoinAndSelect('idCTGN.gomNhom', 'gomNhom', `idCTGN.isDeleted = ${false}`).leftJoinAndSelect(
            'idCTGN.monHoc',
            'monHoc',
            `gomNhom.isDeleted = ${false}`
          );
        })
        .andWhere(`ctkhgd.id = ${id}`)
        .andWhere(`ctkhgd.isDeleted = ${false}`)
        .getOne();
      if (!result) {
        throw new NotFoundException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: ChiTietKeHoachEntity) {
    const oldData = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (newData.idKHGD) await this.keHoachGiangDayService.findById(newData.idKHGD);
    if (newData.idCTGN) await this.chiTietGomNhomService.findById(newData.idCTGN);
    try {
      const result = await this.chiTietKeHoachRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(result.id);
      await this.deleteKeysAfterChange();
      return result;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_NOT_FOUND);
      }
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.chiTietKeHoachRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException();
    try {
      await this.deleteKeysAfterChange();
      const key = format(REDIS_CACHE_VARS.DETAIL_CHI_TIET_KE_HOACH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      return await this.chiTietKeHoachRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }
  async findAllWithSelectField(filter) {
    const key = format(REDIS_CACHE_VARS.LIST_CTKH_SF_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { page = 0, limit = LIMIT, select = '', ...other } = filter;
      const query = {
        isDeleted: false,
        ...other
      };
      result = await this.chiTietKeHoachRepository.find({
        relations: select ? select?.split(',') : [],
        where: query
      });
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CTKH_SF_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async deleteMultipleRows(ids: string, updatedBy?: number): Promise<any> {
    const list_id = ids
      .trim()
      .split(',')
      .map((x) => +x);
    const records = await this.chiTietKeHoachRepository
      .createQueryBuilder('ctkh')
      .where('ctkh.id IN (:...ids)', { ids: list_id })
      .andWhere(`ctkh.isDeleted = ${false}`)
      .getCount();
    if (list_id.length != records) {
      throw new NotFoundException(CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_ID_NOT_FOUND);
    }

    try {
      await this.chiTietKeHoachRepository
        .createQueryBuilder('ctkh')
        .update(ChiTietKeHoachEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .andWhere('id IN (:...ids)', { ids: list_id })
        .execute();
      await this.deleteKeysAfterChange();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }

  async deleteAll(updatedBy?: number): Promise<any> {
    try {
      await this.chiTietKeHoachRepository
        .createQueryBuilder('ctgn')
        .update(ChiTietKeHoachEntity)
        .set({ isDeleted: true, updatedAt: new Date(), updatedBy })
        .where(`isDeleted = ${false}`)
        .execute();
      await this.deleteKeysAfterChange();
    } catch (error) {
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chiTietKeHoachRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED);
    }
  }

  async deleteKeysAfterChange() {
    await this.cacheManager.delCacheList([
      REDIS_CACHE_VARS.LIST_CHI_TIET_KE_HOACH_CACHE_COMMON_KEY,
      REDIS_CACHE_VARS.LIST_CTKH_SF_CACHE_COMMON_KEY
    ]);
  }
}
