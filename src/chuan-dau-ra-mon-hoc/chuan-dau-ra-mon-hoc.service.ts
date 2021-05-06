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
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
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
    private syllabusService: SyllabusService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }

  async create(newData: CreateChuanDauRaMonHocDto, idUser: number) {
    const mucTieuMonHoc = await this.mucTieuMonHocService.findOne(newData.mucTieuMonHoc);
    this.isOwner(mucTieuMonHoc.createdBy, idUser);

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
        createdBy: idUser,
        updatedAt: new Date(),
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_FAILED);
    }
  }

  async findAll(filter: FilterChuanDauRaMonHocDto) {
    const key = format(REDIS_CACHE_VARS.LIST_CDRMH_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { page = 0, limit = LIMIT, idMucTieuMonHoc, idSyllabus } = filter;
      const skip = page * limit;

      if (!(idMucTieuMonHoc || idSyllabus)) {
        const [list, total] = await this.chuanDauRaMonHocService.findAndCount({
          relations: ['createdBy', 'updatedBy'],
          where: { isDeleted: false },
          skip,
          take: limit,
          order: { ma: 'ASC' }
        });
        result = { contents: list, total, page: page };
      } else {
        let query = '';
        if (idSyllabus) {
          await this.syllabusService.findOne(idSyllabus);
          query = `mtmh.idSyllabus=${idSyllabus}`;
        }
        if (idMucTieuMonHoc) {
          await this.mucTieuMonHocService.findOne(idMucTieuMonHoc);
          if (idSyllabus) query += ' And ';
          query += `mtmh.id=${idMucTieuMonHoc}`;
        }
        const [list, total] = await this.chuanDauRaMonHocService
          .createQueryBuilder('cdr')
          .leftJoin('cdr.mucTieuMonHoc', 'mtmh', 'mtmh.isDeleted =:isDeleted', { isDeleted: false })
          .where(query)
          .andWhere('cdr.isDeleted =:isDeleted', { isDeleted: false })
          .leftJoinAndSelect('cdr.updatedBy', 'updatedBy')
          .leftJoinAndSelect('cdr.createdBy', 'createdBy')
          .skip(skip)
          .take(limit)
          .orderBy({ 'cdr.ma': 'ASC' })
          .getManyAndCount();
        result = { contents: list, total, page: page };
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CDRMH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      result = await this.chuanDauRaMonHocService.findOne(id, {
        relations: ['createdBy', 'updatedBy'],
        where: { isDeleted: false }
      });
      if (!result) {
        throw new NotFoundException(CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CDRMH_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: UpdateChuanDauRaMonHocDto, idUser: number) {
    const oldData = await this.chuanDauRaMonHocService.findOne(id, { where: { isDeleted: false } });
    const { mucTieuMonHoc } = newData;
    this.isOwner(oldData.createdBy, idUser);
    if (mucTieuMonHoc) {
      const mtmh = await this.mucTieuMonHocService.findOne(newData.mucTieuMonHoc);
      this.isOwner(mtmh.createdBy, idUser);
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
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(CHUANDAURAMONHOC_MESSAGE.UPDATE_CHUANDAURAMONHOC_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const found = await this.findOne(id);
    this.isOwner(found.createdBy, idUser);
    try {
      return await this.chuanDauRaMonHocService.save({
        ...found,
        updateBy: idUser,
        updatedAt: new Date(),
        isDeleted: true
      });
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
}
