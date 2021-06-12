import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaNganhDaoTaoService } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.service';
import { LIMIT, MUCTIEUMONHOC_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { BaseService } from 'guards/base-service.dto';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class MucTieuMonHocService extends BaseService {
  constructor(
    @InjectRepository(MucTieuMonHocEntity)
    private mucTieuMonHocEntityRepository: Repository<MucTieuMonHocEntity>,
    private syllabusService: SyllabusService,
    private chuanDauRaNganhDaoTaoService: ChuanDauRaNganhDaoTaoService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }

  async create(newData: CreateMucTieuMonHocDto, createdBy: UsersEntity) {
    const syllabus = await this.syllabusService.findOne(newData.syllabus);

    this.checkPermission(syllabus.createdBy, createdBy);
    const syllabusCreatedBy: any = syllabus.createdBy;
    const mucTieuMonHoc = new MucTieuMonHocEntity();
    mucTieuMonHoc.syllabus = newData.syllabus;
    mucTieuMonHoc.ma = newData.ma.toUpperCase().trim();
    mucTieuMonHoc.moTa = newData.moTa;

    if (await this.isExistV2(null, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);
    if (newData.chuanDauRaCDIO) {
      mucTieuMonHoc.chuanDauRaCDIO = [];
      const uniqueId = [];
      for (const id of newData.chuanDauRaCDIO) {
        if (uniqueId.indexOf(id) === -1) {
          uniqueId.push(id);
          const chuanDaura = await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
          mucTieuMonHoc.chuanDauRaCDIO.push(chuanDaura);
        }
      }
    }
    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...mucTieuMonHoc,
        createdAt: new Date(),
        createdBy: syllabusCreatedBy.id,
        updatedAt: new Date(),
        updatedBy: createdBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_KEY, result?.id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async findAll(filter: FilterMucTieuMonHoc) {
    const key = format(REDIS_CACHE_VARS.LIST_MTMH_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { page = 0, limit = LIMIT, idSyllabus, sortBy, searchKey, sortType } = filter;
      const skip = page * limit;
      if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      try {
        const [results, total] = await this.mucTieuMonHocEntityRepository
          .createQueryBuilder('mtmh')
          .leftJoinAndSelect('mtmh.createdBy', 'createdBy')
          .leftJoinAndSelect('mtmh.updatedBy', 'updatedBy')
          .leftJoinAndSelect('mtmh.syllabus', 'syllabus')
          .leftJoinAndSelect('mtmh.chuanDauRaCDIO', 'chuanDauRaCDIO', `chuanDauRaCDIO.isDeleted = ${false}`)
          .where((qb) => {
            qb.leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
              .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
              .leftJoinAndSelect('syllabus.monHoc', 'monHoc');
            idSyllabus ? qb.andWhere('mtmh.syllabus = :idSyllabus', { idSyllabus }) : {};
            searchKey
              ? qb.andWhere('mtmh.ma LIKE :search OR mtmh.mota LIKE :search', {
                  search: `%${searchKey}%`
                })
              : {};
            isSortFieldInForeignKey
              ? qb.orderBy(sortBy, sortType)
              : qb.orderBy(sortBy ? `mtmh.${sortBy}` : null, sortType);
          })
          .andWhere('mtmh.isDeleted = false')
          .skip(skip)
          .take(limit)
          .getManyAndCount();
        result = { contents: results, total, page: Number(page) };
        await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_MTMH_CACHE_TTL);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      try {
        result = await this.mucTieuMonHocEntityRepository
          .createQueryBuilder('mtmh')
          .leftJoinAndSelect('mtmh.createdBy', 'createdBy')
          .leftJoinAndSelect('mtmh.updatedBy', 'updatedBy')
          .leftJoinAndSelect('mtmh.syllabus', 'syllabus')
          .leftJoinAndSelect('mtmh.chuanDauRaCDIO', 'chuanDauRaCDIO', `chuanDauRaCDIO.isDeleted = ${false}`)
          .where((qb) => {
            qb.leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
              .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
              .leftJoinAndSelect('syllabus.monHoc', 'monHoc');
          })
          .where({
            isDeleted: false,
            id
          })
          .getOne();
      } catch (error) {
        throw new InternalServerErrorException();
      }
      if (!result) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: UpdateMucTieuMonHocDto, updatedBy: UsersEntity) {
    const oldData = await this.mucTieuMonHocEntityRepository.findOne(id, {
      where: { isDeleted: false },
      relations: ['createdBy']
    });
    this.checkPermission(oldData.createdBy, updatedBy);
    const { chuanDauRaCDIO } = newData;
    if (await this.isExistV2(oldData, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);
    if (chuanDauRaCDIO) {
      oldData.chuanDauRaCDIO = [];
      const uniqueId = [];
      for (const id of newData.chuanDauRaCDIO) {
        if (uniqueId.indexOf(id) === -1) {
          uniqueId.push(id);
          const chuanDaura = await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
          oldData.chuanDauRaCDIO.push(chuanDaura);
        }
      }
    }
    const { ma, syllabus, moTa } = { ...oldData, ...newData };
    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...oldData,
        ...{ ma: ma.toUpperCase().trim(), syllabus, moTa },
        updatedAt: new Date(),
        updatedBy: updatedBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async remove(id: number, user: UsersEntity) {
    const data = await this.mucTieuMonHocEntityRepository.findOne(id, {
      where: { isDeleted: false },
      relations: ['createdBy']
    });
    if (!data) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    this.checkPermission(data.createdBy, user);
    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...data,
        updatedAt: new Date(),
        updatedBy: user.id,
        isDeleted: true
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_MTMH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_FAILED);
    }
  }

  async isExist(oldData: MucTieuMonHocEntity, newData: MucTieuMonHocEntity): Promise<boolean> {
    const { syllabus, ma }: MucTieuMonHocEntity = newData;
    if (!(syllabus || ma)) return false;
    const loaiDanhGia = { ...oldData, ...newData };
    const queryByMaAndSlylabus = { syllabus: loaiDanhGia.syllabus, ma: loaiDanhGia.ma };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const found = await this.mucTieuMonHocEntityRepository.findOne({ where: query });
    return found ? true : false;
  }
  async isExistV2(oldData: MucTieuMonHocEntity, newData: CreateMucTieuMonHocDto): Promise<boolean> {
    if (!(newData.syllabus || newData.ma)) return false;
    const { syllabus, ma } = { ...oldData, ...newData };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMaAndSlylabus = { syllabus, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const result = await this.mucTieuMonHocEntityRepository.findOne({ where: query });
    return result ? true : false;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.mucTieuMonHocEntityRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_MTMH_CACHE_COMMON_KEY]);
  }

  async addList(data: Array<CreateMucTieuMonHocDto>, user: UsersEntity) {
    const newData = [];
    data.forEach((value, index) => {
      newData[index] = {
        ...value,
        createdBy: user?.id,
        updatedBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      delete newData[index]['id'];
    });

    return await this.mucTieuMonHocEntityRepository.save(newData);
  }
}
