import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { CHUDE_MESSAGE, LIMIT, REDIS_CACHE_VARS } from 'constant/constant';
import { BaseService } from 'guards/base-service.dto';
import { HoatDongDanhGiaService } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.service';
import { HoatDongDayHocService } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.service';
import { LoaiKeHoachGiangDayService } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateChuDeDto } from './dto/create-chu-de';
import { FilterChuDe } from './dto/filter-chu-de';
import { UpdateChuDeDTO } from './dto/update-chu-de';
import { ChuDeEntity, KEY_CD } from './entity/chu-de.entity';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';

@Injectable()
export class ChuDeService extends BaseService {
  constructor(
    @InjectRepository(ChuDeEntity) private chuDeRepository: Repository<ChuDeEntity>,
    private syllabusService: SyllabusService,
    private loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService,
    private hoatDongDayHocService: HoatDongDayHocService,
    private hoatDongDanhGiaService: HoatDongDanhGiaService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService,
    private cacheManager: RedisCacheService
  ) {
    super();
  }

  async findAll(filter: FilterChuDe): Promise<ChuDeEntity[] | any> {
    const key = format(REDIS_CACHE_VARS.LIST_CHU_DE_CACHE_KEY, JSON.stringify(filter));
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const { limit = LIMIT, page = 0, searchKey = '', sortBy, sortType, idLKHGD, idSyllabus } = filter;
      const skip = Number(page) * Number(limit);
      const isSortFieldInForeignKey = sortBy ? sortBy.trim().includes('.') : false;
      const [list, total] = await this.chuDeRepository
        .createQueryBuilder('cd')
        .leftJoinAndSelect('cd.createdBy', 'createdBy')
        .leftJoinAndSelect('cd.updatedBy', 'updatedBy')
        .leftJoinAndSelect('cd.hoatDongDanhGia', 'hoatDongDanhGia', `hoatDongDanhGia.isDeleted = ${false}`)
        .leftJoinAndSelect('cd.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted = ${false}`)
        .leftJoinAndSelect('cd.hoatDongDayHoc', 'hoatDongDayHoc')
        .innerJoinAndSelect('cd.idSyllabus', 'syllabus', 'syllabus.isDeleted = false')
        .leftJoinAndSelect('cd.idLKHGD', 'lhkgd')
        .where((qb) => {
          qb.leftJoinAndSelect(
            'hoatDongDanhGia.chuanDauRaMonHoc',
            'hddgchuanDauRaMonHoc',
            `hddgchuanDauRaMonHoc.isDeleted = ${false}`
          )
            .leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
            .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
            .leftJoinAndSelect('syllabus.monHoc', 'monHoc');
          isSortFieldInForeignKey ? qb.orderBy(sortBy, sortType) : qb.orderBy(sortBy ? `cd.${sortBy}` : null, sortType);
          idSyllabus ? qb.andWhere('syllabus.id = :idSyllabus', { idSyllabus }) : {};
          idLKHGD ? qb.andWhere('lhkgd.id = :idLKHGD', { idLKHGD }) : {};
          searchKey
            ? qb.andWhere('(cd.ten LIKE :search OR cd.ma LIKE :search or cd.tuan = :tuan)', {
                search: `%${searchKey}%`,
                tuan: Number.isNaN(Number(searchKey)) ? -1 : searchKey
              })
            : {};
        })
        .skip(skip)
        .take(Number(limit) === -1 ? null : Number(limit))
        .andWhere(`cd.isDeleted = ${false}`)
        .getManyAndCount();
      result = { contents: list, total, page: Number(page) };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.LIST_CHU_DE_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async findOne(id: number): Promise<ChuDeEntity> {
    const key = format(REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_KEY, id.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined' || result === null) {
      const query = await this.chuDeRepository
        .createQueryBuilder('cd')
        .leftJoinAndSelect('cd.createdBy', 'createdBy')
        .leftJoinAndSelect('cd.updatedBy', 'updatedBy')
        .leftJoinAndSelect('cd.hoatDongDanhGia', 'hoatDongDanhGia', `hoatDongDanhGia.isDeleted = ${false}`)
        .leftJoinAndSelect('cd.chuanDauRaMonHoc', 'chuanDauRaMonHoc', `chuanDauRaMonHoc.isDeleted = ${false}`)
        .leftJoinAndSelect('cd.hoatDongDayHoc', 'hoatDongDayHoc', `hoatDongDayHoc.isDeleted = ${false}`)
        .innerJoinAndSelect('cd.idSyllabus', 'syllabus', 'syllabus.isDeleted = false')
        .leftJoinAndSelect('cd.idLKHGD', 'lhkgd')
        .where((qb) => {
          qb.leftJoinAndSelect(
            'hoatDongDanhGia.chuanDauRaMonHoc',
            'hddgchuanDauRaMonHoc',
            `hddgchuanDauRaMonHoc.isDeleted = ${false}`
          )
            .leftJoinAndSelect('syllabus.heDaoTao', 'heDaoTao')
            .leftJoinAndSelect('syllabus.namHoc', 'namHoc')
            .leftJoinAndSelect('syllabus.monHoc', 'monHoc');
        })
        .andWhere(`cd.isDeleted = ${false} and cd.id = ${id}`);
      result = await query.getOne();
      if (!result) {
        throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
      }
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async create(newData: CreateChuDeDto, createdBy: UsersEntity): Promise<any> {
    const syllabus = await this.syllabusService.findOne(newData.idSyllabus);
    await this.loaiKeHoachGiangDayService.findById(newData.idLKHGD);
    this.checkPermission(syllabus.createdBy, createdBy);
    const syllabusCreatedBy: any = syllabus.createdBy;

    if (await this.isExist(null, newData)) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }
    const chuDe = await this.createEntity(new ChuDeEntity(), newData, newData.idSyllabus);
    try {
      const result = await this.chuDeRepository.save({
        ...chuDe,
        createdBy: syllabusCreatedBy.id,
        updatedBy: createdBy.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_KEY, result?.id.toString());
      const detail = await this.findOne(result.id);
      await this.cacheManager.set(key, detail, REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_TTL);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CHUDE_MESSAGE.CHUDE_FOREIGN_KEY_NOT_FOUND);
      }
      throw new InternalServerErrorException(CHUDE_MESSAGE.CREATE_CHUDE_FAILED);
    }
  }

  async update(id: number, newData: UpdateChuDeDTO, updatedBy: UsersEntity): Promise<any> {
    const oldData = await this.findOne(id);
    this.checkPermission(oldData.createdBy, updatedBy);
    let { idSyllabus } = newData;
    if (idSyllabus) {
      const syllabys = await this.syllabusService.findOne(newData.idSyllabus);
      this.checkPermission(syllabys.createdBy, updatedBy);
    } else {
      const syllabys: any = oldData.idSyllabus;
      const { id } = syllabys;
      idSyllabus = id;
    }
    if (newData.idLKHGD) await this.loaiKeHoachGiangDayService.findById(newData.idLKHGD);

    if (await this.isExist(oldData, newData)) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }
    const chuDe = await this.createEntity(oldData, newData, idSyllabus);
    try {
      const result = await this.chuDeRepository.save({
        ...chuDe,
        updatedAt: new Date(),
        updatedBy: updatedBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.findOne(result.id);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      if (error?.sqlState === '23000') {
        throw new BadRequestException(CHUDE_MESSAGE.CHUDE_FOREIGN_KEY_NOT_FOUND);
      }
      throw new InternalServerErrorException(CHUDE_MESSAGE.UPDATE_CHUDE_FAILED);
    }
  }

  async delete(id: number, updatedBy?: UsersEntity): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ where: { id, isDeleted: false }, relations: ['createdBy'] });
    this.checkPermission(chude.createdBy, updatedBy);
    if (!chude) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }
    try {
      const result = await this.chuDeRepository.save({
        ...chude,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy: updatedBy.id
      });
      const key = format(REDIS_CACHE_VARS.DETAIL_CHU_DE_CACHE_KEY, id.toString());
      await this.cacheManager.del(key);
      await this.delCacheAfterChange();
      return result;
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.DELETE_CHUDE_FAILED);
    }
  }
  private async isExist(oldData: ChuDeEntity, newData: CreateChuDeDto): Promise<boolean> {
    if (!(newData.idSyllabus || newData.idLKHGD || newData.tuan || newData.ma)) return false;
    const idSyllabus = newData.idSyllabus ? newData.idSyllabus : oldData?.idLKHGD;
    const idLKHGD = newData.idLKHGD ? newData.idLKHGD : oldData?.idLKHGD;
    const tuan = newData.tuan ? newData.tuan : oldData?.tuan;
    const ma = newData.ma ? newData.ma : oldData?.ma;
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const queryCheckUnique = { ma, idLKHGD, idSyllabus, tuan };
    const query = {
      isDeleted: false,
      ...queryCheckUnique,
      ...notID
    };
    const result = await this.chuDeRepository.findOne({ where: query });
    return result ? true : false;
  }
  private async createEntity(chuDe: ChuDeEntity, newData: CreateChuDeDto, idSyllabus: number): Promise<ChuDeEntity> {
    const { chuanDauRaMonHoc, hoatDongDanhGia, hoatDongDayHoc } = newData;
    const dataUpdate = { chuanDauRaMonHoc, hoatDongDanhGia, hoatDongDayHoc };
    for (const key in keyService) {
      if (!chuDe[key]) {
        chuDe[key] = [];
      } else if (dataUpdate[key]) {
        chuDe[key] = chuDe[key].filter((e) => {
          // Giữ lại những chuanDauRa có trong phần update
          return dataUpdate[key].indexOf(e.id.toString()) >= 0;
        });
      }
      const uniqueId = []; // Giữ những chuanDaura đã được push vào loaiDanhGia
      const arrId = chuDe[key].map((e: any) => e.id.toString()); //Tạo ra 1 array chuanDauRa

      if (dataUpdate[key]) {
        for (const idData of dataUpdate[key]) {
          if (!Number.isNaN(Number(idData))) {
            if (uniqueId.indexOf(idData) === -1) {
              uniqueId.push(idData);
              if (arrId.indexOf(idData) === -1) {
                const service = this.getService(keyService[key]);
                let result;
                if (keyService[key] === keyService.hoatDongDayHoc) {
                  result = await service.findOne(Number(idData));
                } else {
                  try {
                    result = await service.isInSyllabus(Number(idData), idSyllabus);
                  } catch (error) {
                    throw new BadRequestException(error?.message);
                  }
                }
                chuDe[key].push(result);
              }
            }
          } else {
            throw new BadRequestException(CHUDE_MESSAGE.CHUDE_INPUT_ARRAY_INVALIAD);
          }
        }
        delete newData[key];
      }
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        chuDe[KEY_CD[key]] = newData[key];
      }
    }
    return chuDe;
  }
  private getService(key: number): ChuanDauRaMonHocService | HoatDongDanhGiaService | HoatDongDayHocService {
    switch (key) {
      case keyService.chuanDauRaMonHoc:
        return this.chuanDauRaMonHocService;
      case keyService.hoatDongDanhGia:
        return this.hoatDongDanhGiaService;
      case keyService.hoatDongDayHoc:
        return this.hoatDongDayHocService;
    }
  }

  async deleteRowIsDeleted(): Promise<any> {
    try {
      await this.chuDeRepository.delete({ isDeleted: true });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(CHUDE_MESSAGE.DELETE_CHUDE_FAILED);
    }
  }

  async delCacheAfterChange() {
    await this.cacheManager.delCacheList([REDIS_CACHE_VARS.LIST_CHU_DE_CACHE_COMMON_KEY]);
  }

  async addList(data: Array<CreateChuDeDto>, user: UsersEntity) {
    const newData = [];
    try {
      data.forEach(async (value, index) => {
        const chuDe = await this.createEntity(new ChuDeEntity(), value, value.idSyllabus);
        newData[index] = {
          ...chuDe,
          createdBy: user?.id,
          updatedBy: user?.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete newData[index]['id'];
      });
      return await this.chuDeRepository.save(newData);
    } catch (error) {
      throw new InternalServerErrorException(error?.message || CHUDE_MESSAGE.DELETE_CHUDE_FAILED);
    }
  }
}
const keyService = {
  chuanDauRaMonHoc: 1,
  hoatDongDanhGia: 2,
  hoatDongDayHoc: 3
};
