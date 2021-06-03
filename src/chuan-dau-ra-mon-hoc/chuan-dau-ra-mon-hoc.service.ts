import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURAMONHOC_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { BaseService } from 'guards/base-service.dto';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { Not, Repository } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';
import { ChuanDauRaMonHocEntity } from './entity/chuan-dau-ra-mon-hoc.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class ChuanDauRaMonHocService extends BaseService {
  constructor(
    @InjectRepository(ChuanDauRaMonHocEntity)
    private chuanDauRaMonHocService: Repository<ChuanDauRaMonHocEntity>,
    private mucTieuMonHocService: MucTieuMonHocService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }

  async create(newData: CreateChuanDauRaMonHocDto, createdBy: UsersEntity) {
    const mucTieuMonHoc = await this.mucTieuMonHocService.findOne(newData.mucTieuMonHoc);
    this.checkPermission(mucTieuMonHoc.createdBy, createdBy);
    const muTieuMonHocCreatedBy: any = mucTieuMonHoc.createdBy;
    const chuanDauRaMonHoc = new ChuanDauRaMonHocEntity();
    const { mucDo } = newData;
    if (mucDo) {
      chuanDauRaMonHoc.mucDo = mucDo.join(', ');
      delete newData.mucDo;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        chuanDauRaMonHoc[key] = newData[key];
      }
    }
    if (await this.isExistV2(null, newData))
      throw new ConflictException(CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_EXIST);
    try {
      const result = await this.chuanDauRaMonHocService.save({
        ...chuanDauRaMonHoc,
        createdAt: new Date(),
        createdBy: muTieuMonHocCreatedBy.id,
        updatedAt: new Date(),
        updatedBy: createdBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_KEY, result?.id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_FAILED);
    }
  }

  async findAll(filter: FilterChuanDauRaMonHocDto) {
    const key = format(REDIS_CACHE_VARS.LIST_CDRMH_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { page = 0, limit = LIMIT, idMucTieuMonHoc, idSyllabus, sortBy, sortType, searchKey } = filter;
      const skip = page * limit;
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const [list, total] = await this.chuanDauRaMonHocService
        .createQueryBuilder('cdr')
        .leftJoinAndSelect('cdr.mucTieuMonHoc', 'mtmh', 'mtmh.isDeleted =:isDeleted', { isDeleted: false })
        .leftJoinAndSelect('cdr.updatedBy', 'updatedBy')
        .leftJoinAndSelect('cdr.createdBy', 'createdBy')
        .where((qb) => {
          idSyllabus ? qb.andWhere('mtmh.idSyllabus = :idSyllabus', { idSyllabus }) : {};
          idMucTieuMonHoc ? qb.andWhere('cdr.mucTieuMonHoc = :idMucTieuMonHoc', { idMucTieuMonHoc }) : {};
          searchKey
            ? qb.andWhere('cdr.ma LIKE :search OR cdr.mota LIKE :search OR cdr.mucDo LIKE :search', {
                search: `%${searchKey}%`
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `cdr.${sortBy}` : null, sortType);
        })
        .andWhere('cdr.isDeleted =:isDeleted', { isDeleted: false })
        .skip(skip)
        .take(limit)
        .getManyAndCount();
      result = { contents: list, total, page: page };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CDRMH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const found = await this.chuanDauRaMonHocService.findOne(id, {
        relations: ['mucTieuMonHoc', 'createdBy', 'updatedBy'],
        where: { isDeleted: false }
      });
      if (!found) {
        throw new NotFoundException(CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND);
      }
      result = found;
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: UpdateChuanDauRaMonHocDto, updatedBy: UsersEntity) {
    const oldData = await this.chuanDauRaMonHocService.findOne(id, {
      where: { isDeleted: false },
      relations: ['createdBy']
    });
    const { mucTieuMonHoc } = newData;
    this.checkPermission(oldData.createdBy, updatedBy);
    if (mucTieuMonHoc) {
      const mtmh = await this.mucTieuMonHocService.findOne(newData.mucTieuMonHoc);
      this.checkPermission(mtmh.createdBy, updatedBy);
    }
    if (await this.isExistV2(oldData, newData))
      throw new ConflictException(CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_EXIST);
    const { mucDo } = newData;
    if (mucDo) {
      oldData.mucDo = mucDo.join(', ');
      delete newData.mucDo;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        oldData[key] = newData[key];
      }
    }
    try {
      const result = await this.chuanDauRaMonHocService.save({
        ...oldData,
        updatedAt: new Date(),
        updatedBy: updatedBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.UPDATE_CHUANDAURAMONHOC_FAILED);
    }
  }

  async remove(id: number, user: UsersEntity) {
    const found = await this.findOne(id);
    this.checkPermission(found.createdBy, user);
    try {
      const result = await this.chuanDauRaMonHocService.save({
        ...found,
        updateBy: user.id,
        updatedAt: new Date(),
        isDeleted: true
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_FAILED);
    }
  }
  async isExistV2(oldData: ChuanDauRaMonHocEntity, newData: CreateChuanDauRaMonHocDto): Promise<boolean> {
    if (!(newData.mucTieuMonHoc || newData.ma)) return false;
    const { mucTieuMonHoc, ma } = { ...oldData, ...newData };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMaAndMTMH: ChuanDauRaMonHocEntity = { mucTieuMonHoc, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndMTMH,
      ...notID
    };
    const result = await this.chuanDauRaMonHocService.findOne({ where: query });
    return result ? true : false;
  }
  async isInSyllabus(idChuanDauRa: number, idSyllabus: number) {
    const query = this.chuanDauRaMonHocService
      .createQueryBuilder('cdrmh')
      .leftJoin('cdrmh.mucTieuMonHoc', 'mtmh', 'mtmh.isDeleted = false')
      .leftJoinAndSelect('cdrmh.createdBy', 'createdBy')
      .leftJoinAndSelect('cdrmh.updatedBy', 'updatedBy')
      .where((qb) => {
        qb.where('mtmh.syllabus = :idSyllabus', { idSyllabus });
      })
      .andWhere('cdrmh.isDeleted = false')
      .andWhere('cdrmh.id = :idChuanDauRa', { idChuanDauRa });
    const result = await query.getOne();
    if (!result) throw new BadRequestException(`CHUANDAURA_${idChuanDauRa}_NOT_IN_SYLLABUS`);
    return result;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chuanDauRaMonHocService.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_CDRMH_CACHE_COMMON_KEY]);
  }

  async addList(data: Array<CreateChuanDauRaMonHocDto>, user: UsersEntity) {
    const newData = [];
    data.forEach((value, index) => {
      newData[index] = {
        ...value,
        createBy: user?.id,
        updateBy: user?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      delete newData[index]['id'];
    });
    return await this.chuanDauRaMonHocService.save(newData);
  }
}
