import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { LIMIT, LOAIDANHGIA_MESSAGE, REDIS_CACHE_VARS } from 'constant/constant';
import { BaseService } from 'guards/base-service.dto';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateLoaiDanhGiaDto } from './dto/create-loai-danh-gia.dto';
import { FilterLoaiDanhGia } from './dto/filter-loai-danh-gia.dto';
import { UpdateLoaiDanhGiaDto } from './dto/update-loai-danh-gia.dto';
import { KEY_LDG, LoaiDanhGiaEntity } from './entity/loai-danh-gia.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class LoaiDanhGiaService extends BaseService {
  constructor(
    @InjectRepository(LoaiDanhGiaEntity)
    private loaiDanhGiaRepository: Repository<LoaiDanhGiaEntity>,
    private syllabusService: SyllabusService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }

  async create(newData: CreateLoaiDanhGiaDto, createdBy: UsersEntity) {
    const syllabus = await this.syllabusService.findOne(newData.idSyllabus);
    this.checkPermission(syllabus.createdBy, createdBy);
    const syllabusCreatedBy: any = syllabus.createdBy;
    if (await this.isExistV2(null, newData)) throw new ConflictException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST);

    const loaiDanhGia = await this.createEntity(new LoaiDanhGiaEntity(), newData, newData.idSyllabus);
    try {
      const result = await this.loaiDanhGiaRepository.save({
        ...loaiDanhGia,
        createdAt: new Date(),
        createdBy: syllabusCreatedBy.id,
        updatedAt: new Date(),
        updatedBy: createdBy.id
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_FAILED);
    }
  }

  async findAll(filter: FilterLoaiDanhGia) {
    const key = format(REDIS_CACHE_VARS.LIST_LDG_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const { page = 0, limit = LIMIT, idSyllabus, sortBy, sortType, searchKey } = filter;
      const skip = page * limit;
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
      const [results, total] = await this.loaiDanhGiaRepository
        .createQueryBuilder('ldg')
        .leftJoinAndSelect('ldg.syllabus', 'syllabus')
        .leftJoinAndSelect('ldg.createdBy', 'createdBy')
        .leftJoinAndSelect('ldg.updatedBy', 'updatedBy')
        .leftJoinAndSelect('ldg.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted = ${false}`)
        .leftJoinAndSelect('ldg.hoatDongDanhGia', 'hoatDongDanhGia', `hoatDongDanhGia.isDeleted = ${false}`)
        .where((qb) => {
          qb.leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
            .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
            .leftJoinAndSelect('syllabus.monHoc', 'monHoc')
            .leftJoinAndSelect('hoatDongDanhGia.chuanDauRaMonHoc', 'cdrmh', `cdrmh.isDeleted = ${false}`);
          idSyllabus ? qb.andWhere('ldg.syllabus = :idSyllabus', { idSyllabus }) : {};
          searchKey
            ? qb.andWhere('ldg.ten LIKE :search OR ldg.ma LIKE :search OR ldg.tyle = :tyle', {
                search: `%${searchKey}%`,
                tyle: Number.isNaN(Number(searchKey)) ? -1 : searchKey
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `ldg.${sortBy}` : null, sortType);
        })
        .andWhere(`ldg.isDeleted = ${false}`)
        .take(limit)
        .skip(skip)
        .getManyAndCount();
      result = { contents: results, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_LDG_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_LDG_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      try {
        result = await this.loaiDanhGiaRepository
          .createQueryBuilder('ldg')
          .leftJoinAndSelect('ldg.syllabus', 'syllabus')
          .leftJoinAndSelect('ldg.createdBy', 'createdBy')
          .leftJoinAndSelect('ldg.updatedBy', 'updatedBy')
          .leftJoinAndSelect('ldg.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted = ${false}`)
          .leftJoinAndSelect('ldg.hoatDongDanhGia', 'hoatDongDanhGia', `hoatDongDanhGia.isDeleted = ${false}`)
          .where((qb) => {
            qb.leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
              .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
              .leftJoinAndSelect('syllabus.monHoc', 'monHoc')
              .leftJoinAndSelect('hoatDongDanhGia.chuanDauRaMonHoc', 'cdrmh', `cdrmh.isDeleted = ${false}`);
          })
          .where({
            isDeleted: false,
            id
          })
          .getOne();
      } catch (error) {
        throw new InternalServerErrorException();
      }
      if (!result) throw new NotFoundException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND);
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_LDG_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: UpdateLoaiDanhGiaDto, updatedBy: UsersEntity) {
    const oldData = await this.findOne(id);
    this.checkPermission(oldData.createdBy, updatedBy);
    let { idSyllabus } = newData;
    if (idSyllabus) {
      const syllabus = await this.syllabusService.findOne(idSyllabus);
      this.checkPermission(syllabus.createdBy, updatedBy);
    } else {
      const syllabus: any = oldData.syllabus;
      const { id } = syllabus;
      idSyllabus = id;
    }

    if (await this.isExistV2(oldData, newData)) throw new ConflictException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST);

    const loaiDanhGia = await this.createEntity(oldData, newData, idSyllabus);

    try {
      const result = await this.loaiDanhGiaRepository.save({
        ...loaiDanhGia,
        updatedBy: updatedBy.id,
        updatedAt: new Date()
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.UPDATE_LOAIDANHGIA_FAILED);
    }
  }

  async remove(id: number, user: UsersEntity) {
    const result = await this.loaiDanhGiaRepository.findOne(id, {
      where: { isDeleted: false },
      relations: ['createdBy']
    });
    if (!result) throw new NotFoundException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND);
    this.checkPermission(result.createdBy, user);
    try {
      return await this.loaiDanhGiaRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: user.id,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_FAILED);
    }
  }

  async isExist(oldData: LoaiDanhGiaEntity, newData: LoaiDanhGiaEntity): Promise<boolean> {
    const { syllabus, ma }: LoaiDanhGiaEntity = newData;
    if (!(syllabus || ma)) return false;
    const loaiDanhGia = { ...oldData, ...newData };
    const queryByMaAndSlylabus = { syllabus: loaiDanhGia.syllabus, ma: loaiDanhGia.ma };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const found = await this.loaiDanhGiaRepository.findOne({ where: query });
    return found ? true : false;
  }
  async isExistV2(oldData: LoaiDanhGiaEntity, newData: CreateLoaiDanhGiaDto): Promise<boolean> {
    if (!(newData.idSyllabus || newData.ma)) return false;
    const idSyllabus = newData.idSyllabus ? newData.idSyllabus : oldData.syllabus;
    const ma = newData.ma ? newData.ma : oldData.ma;
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMaAndSlylabus = { syllabus: idSyllabus, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const result = await this.loaiDanhGiaRepository.findOne({ where: query });
    return result ? true : false;
  }

  async createEntity(
    loaiDanhGia: LoaiDanhGiaEntity,
    newData: CreateLoaiDanhGiaDto,
    idSyllabus: number
  ): Promise<LoaiDanhGiaEntity> {
    const { chuanDauRaMonHoc } = newData;
    if (!loaiDanhGia.chuanDauRaMonHoc) {
      loaiDanhGia.chuanDauRaMonHoc = [];
    } else if (chuanDauRaMonHoc) {
      loaiDanhGia.chuanDauRaMonHoc = loaiDanhGia.chuanDauRaMonHoc.filter((chuanDuaRa) => {
        // Giữ lại những chuanDauRa có trong phần update
        return chuanDauRaMonHoc.indexOf(chuanDuaRa.id.toString()) >= 0;
      });
    }
    const uniqueId = []; // Giữ những chuanDaura đã được push vào loaiDanhGia
    const arrChuanDauRaMonHoc = loaiDanhGia.chuanDauRaMonHoc.map((e) => e.id.toString()); //Tạo ra 1 array chuanDauRa
    if (chuanDauRaMonHoc) {
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          if (arrChuanDauRaMonHoc.indexOf(idCDRMH) === -1) {
            const result = await this.chuanDauRaMonHocService.isInSyllabus(Number(idCDRMH), idSyllabus);
            loaiDanhGia.chuanDauRaMonHoc.push(result);
          }
        }
      }
      delete newData.chuanDauRaMonHoc;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        loaiDanhGia[KEY_LDG[key]] = newData[key];
      }
    }
    return loaiDanhGia;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.loaiDanhGiaRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_FAILED);
    }
  }
}
