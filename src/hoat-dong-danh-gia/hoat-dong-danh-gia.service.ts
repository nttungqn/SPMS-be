import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { HOATDONGDANHGIA_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { BaseService } from 'guards/base-service.dto';
import { LoaiDanhGiaService } from 'loai-danh-gia/loai-danh-gia.service';
import { Not, Repository } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateHoatDongDanhGiaDto } from './dto/create-hoat-dong-danh-gia.dto';
import { FilterHoatDongDanhGia } from './dto/filter-hoat-dong-danh-gia.dto';
import { UpdateHoatDongDanhGiaDto } from './dto/update-hoat-dong-danh-gia.dto';
import { HoatDongDanhGiaEntity, KeyHDDG } from './entity/hoat-dong-danh-gia.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class HoatDongDanhGiaService extends BaseService {
  constructor(
    @InjectRepository(HoatDongDanhGiaEntity)
    private hoatDongDanhGiaService: Repository<HoatDongDanhGiaEntity>,
    private loaiDanhGiaService: LoaiDanhGiaService,
    private chuaDauRaMonHocService: ChuanDauRaMonHocService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }
  async create(newData: CreateHoatDongDanhGiaDto, createdBy: UsersEntity) {
    const loaiDanhGia = await this.loaiDanhGiaService.findOne(newData.idLoaiDanhGia);
    this.checkPermission(loaiDanhGia.createdBy, createdBy);
    const loaiDanhGiaCreatedBy: any = loaiDanhGia.createdBy;
    //Lấy idSyllabus
    const syllabus: any = loaiDanhGia.syllabus;
    const { id } = syllabus;
    const idSyllabus = id;
    ///
    if (await this.isExistV2(null, newData)) throw new ConflictException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST);
    const hoatDongDanhGia = new HoatDongDanhGiaEntity();
    const { chuanDauRaMonHoc } = newData;
    if (chuanDauRaMonHoc) {
      hoatDongDanhGia.chuanDauRaMonHoc = [];
      const uniqueId = [];
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          try {
            const result = await this.chuaDauRaMonHocService.isInSyllabus(Number(idCDRMH), idSyllabus);
            hoatDongDanhGia.chuanDauRaMonHoc.push(result);
          } catch (error) {
            console.log(error);
          }
        }
      }
      delete newData.chuanDauRaMonHoc;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        hoatDongDanhGia[KeyHDDG[key]] = newData[key];
      }
    }
    hoatDongDanhGia.ma = hoatDongDanhGia.ma.toUpperCase().trim();
    try {
      const saved = await this.hoatDongDanhGiaService.save({
        ...hoatDongDanhGia,
        createdAt: new Date(),
        createdBy: loaiDanhGiaCreatedBy.id,
        updatedAt: new Date(),
        updatedBy: createdBy.id
      });
      const result = await this.findOne(saved.id);
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_KEY, result?.id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_FAILED);
    }
  }

  async findAll(filter: FilterHoatDongDanhGia) {
    const key = format(REDIS_CACHE_VARS.LIST_HDDG_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { page = 0, limit = LIMIT, sortBy, sortType, searchKey, idLoaiDanhGia, idSyllabus } = filter;
      const skip = page * limit;
      console.log(Number.isNaN(Number(searchKey)) ? -1 : Number(searchKey));
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const [results, total] = await this.hoatDongDanhGiaService
        .createQueryBuilder('hddg')
        .leftJoin('hddg.loaiDanhGia', 'ldg', 'ldg.isDeleted = false')
        .leftJoinAndSelect('hddg.updatedBy', 'updatedBy')
        .leftJoinAndSelect('hddg.createdBy', 'createdBy')
        .leftJoinAndSelect('hddg.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted =${false}`)
        .leftJoinAndSelect('hddg.loaiDanhGia', 'loaiDanhGia', `loaiDanhGia.isDeleted =${false}`)
        .where((qb) => {
          idSyllabus ? qb.where('ldg.idSyllabus = :idSyllabus', { idSyllabus }) : {};
          idLoaiDanhGia ? qb.andWhere('ldg.id = :idLoaiDanhGia', { idLoaiDanhGia }) : {};
          searchKey
            ? qb.andWhere('hddg.ten LIKE :search OR hddg.ma LIKE :search OR hddg.tyLe = :tyle', {
                search: `%${searchKey}%`,
                tyle: Number.isNaN(Number(searchKey)) ? -1 : Number(searchKey)
              })
            : {};
          isSortFieldInForeignKey
            ? qb.orderBy(sortBy, sortType)
            : qb.orderBy(sortBy ? `hddg.${sortBy}` : null, sortType);
        })
        .andWhere('hddg.isDeleted = false')
        .skip(skip)
        .take(Number(limit) === -1 ? null: Number(limit))
        .getManyAndCount();
      result = { contents: results, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_HDDG_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number) {
    const key = format(REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      result = await this.hoatDongDanhGiaService
        .createQueryBuilder('hddg')
        .leftJoinAndSelect('hddg.updatedBy', 'updatedBy')
        .leftJoinAndSelect('hddg.createdBy', 'createdBy')
        .leftJoinAndSelect('hddg.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted =${false}`)
        .leftJoinAndSelect('hddg.loaiDanhGia', 'loaiDanhGia', `loaiDanhGia.isDeleted =${false}`)
        .andWhere('hddg.id = :id', { id: id })
        .andWhere('hddg.isDeleted =:isDeleted', { isDeleted: false })
        .getOne();
      if (!result) {
        throw new NotFoundException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async update(id: number, newData: UpdateHoatDongDanhGiaDto, updateBy: UsersEntity) {
    const oldData = await this.findOne(id);
    this.checkPermission(oldData.createdBy, updateBy);
    const { idLoaiDanhGia } = newData;
    let idSyllabus: number;
    if (idLoaiDanhGia) {
      const loaiDanhGia = await this.loaiDanhGiaService.findOne(newData.idLoaiDanhGia);
      this.checkPermission(loaiDanhGia.createdBy, updateBy);

      const syllabus: any = loaiDanhGia.syllabus;
      const { id } = syllabus;
      idSyllabus = id;
    } else {
      const loaiDanhGia: any = oldData.loaiDanhGia;
      const { syllabus } = loaiDanhGia;
      idSyllabus = syllabus;
    }
    if (await this.isExistV2(oldData, newData))
      throw new ConflictException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST);
    const { chuanDauRaMonHoc } = newData;
    if (chuanDauRaMonHoc) {
      oldData.chuanDauRaMonHoc = [];
      const uniqueId = [];
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          const result = await this.chuaDauRaMonHocService.isInSyllabus(Number(idCDRMH), idSyllabus);
          oldData.chuanDauRaMonHoc.push(result);
        }
      }
      delete newData.chuanDauRaMonHoc;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        oldData[KeyHDDG[key]] = newData[key];
      }
    }
    oldData.ma = oldData.ma.toUpperCase().trim();
    try {
      const result = await this.hoatDongDanhGiaService.save({
        ...oldData,
        updatedAt: new Date(),
        updatedBy: updateBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.UPDATE_HOATDONGDANHGIA_FAILED);
    }
  }

  async remove(id: number, user: UsersEntity) {
    const found = await this.findOne(id);
    this.checkPermission(found.createdBy, user);
    try {
      const result = await this.hoatDongDanhGiaService.save({
        ...found,
        updateBy: user.id,
        updatedAt: new Date(),
        isDeleted: true
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_HDDG_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.DELETE_HOATDONGDANHGIA_FAILED);
    }
  }
  async isExistV2(oldData: HoatDongDanhGiaEntity, newData: CreateHoatDongDanhGiaDto): Promise<boolean> {
    if (!(newData.idLoaiDanhGia || newData.ma)) return false;
    const idLoaiDanhGia = newData.idLoaiDanhGia ? newData.idLoaiDanhGia : oldData.loaiDanhGia;
    const ma = newData.ma ? newData.ma : oldData.ma;
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryByMaAndLDG = { loaiDanhGia: idLoaiDanhGia, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndLDG,
      ...notID
    };
    const result = await this.hoatDongDanhGiaService.findOne({ where: query });
    return result ? true : false;
  }
  async isInSyllabus(idHoatDongDanhGia: number, idSyllabus: number) {
    const query = this.hoatDongDanhGiaService
      .createQueryBuilder('hddg')
      .leftJoin('hddg.loaiDanhGia', 'ldg', 'ldg.isDeleted = false')
      .leftJoinAndSelect('ldg.createdBy', 'createdBy')
      .leftJoinAndSelect('ldg.updatedBy', 'updatedBy')
      .where((qb) => {
        qb.where('ldg.syllabus = :idSyllabus', { idSyllabus });
      })
      .andWhere('hddg.isDeleted = false')
      .andWhere('hddg.id = :idHoatDongDanhGia', { idHoatDongDanhGia });
    const result = await query.getOne();
    if (!result) throw new BadRequestException(`HOATDONGDANHGIA_${idHoatDongDanhGia}_NOT_IN_SYLLABUS`);
    return result;
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.hoatDongDanhGiaService.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.DELETE_HOATDONGDANHGIA_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_HDDG_CACHE_COMMON_KEY]);
  }

  async createEntity(newData: CreateHoatDongDanhGiaDto, idSyllabus: number) {
    const hoatDongDanhGia = new HoatDongDanhGiaEntity();
    const { chuanDauRaMonHoc } = newData;
    if (chuanDauRaMonHoc) {
      hoatDongDanhGia.chuanDauRaMonHoc = [];
      const uniqueId = [];
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          try {
            const result = await this.chuaDauRaMonHocService.isInSyllabus(Number(idCDRMH), idSyllabus);
            hoatDongDanhGia.chuanDauRaMonHoc.push(result);
          } catch (error) {
            console.log(error);
          }
        }
      }
      delete newData.chuanDauRaMonHoc;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        hoatDongDanhGia[KeyHDDG[key]] = newData[key];
      }
    }
    return hoatDongDanhGia;
  }

  async addList(data: Array<CreateHoatDongDanhGiaDto>, user: UsersEntity, syllabusId: number) {
    const newData = [];
    await Promise.all(
      data.map(async (value) => {
        delete value['id'];
        const hoatDongDanhGia = await this.createEntity(value, syllabusId);
        newData.push({
          ...hoatDongDanhGia,
          createdBy: user?.id,
          updatedBy: user?.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      })
    );
    return await this.hoatDongDanhGiaService.save(newData);
  }
}
