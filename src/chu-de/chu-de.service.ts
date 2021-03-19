import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { CHUDE_MESSAGE, LIMIT } from 'constant/constant';
import { HoatDongDanhGiaEntity } from 'hoat-dong-danh-gia/entity/hoat-dong-danh-gia.entity';
import { HoatDongDanhGiaService } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.service';
import { HoatDongDayHocService } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.service';
import { LoaiKeHoachGiangDayService } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Like, Not, Repository } from 'typeorm';
import { CreateChuDeDto } from './dto/create-chu-de';
import { FilterChuDe } from './dto/filter-chu-de';
import { UpdateChuDeDTO } from './dto/update-chu-de';
import { ChuDeEntity, KEY_CD } from './entity/chu-de.entity';

@Injectable()
export class ChuDeService {
  constructor(
    @InjectRepository(ChuDeEntity) private chuDeRepository: Repository<ChuDeEntity>,
    private syllabusService: SyllabusService,
    private loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService,
    private hoatDongDayHocService: HoatDongDayHocService,
    private hoatDongDanhGiaService: HoatDongDanhGiaService,
    private chuanDauRaMonHocService: ChuanDauRaMonHocService
  ) {}

  async findAll(filter: FilterChuDe): Promise<ChuDeEntity[] | any> {
    const { limit = LIMIT, page = 0, search = '', ...otherParam } = filter;
    const skip = Number(page) * Number(limit);
    const querySearch = search ? { ten: Like(`%${search}%`) } : {};
    const query = {
      isDeleted: false,
      ...querySearch,
      ...otherParam
    };

    const results = await this.chuDeRepository.find({
      where: query,
      skip,
      take: Number(limit),
      relations: ['createdBy', 'updatedBy', 'hoatDongDanhGia', 'chuanDauRaMonHoc', 'hoatDongDayHoc']
    });
    const total = await this.chuDeRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number): Promise<ChuDeEntity | any> {
    const result = await this.chuDeRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['createdBy', 'updatedBy', 'hoatDongDanhGia', 'chuanDauRaMonHoc', 'hoatDongDayHoc']
    });
    if (!result) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }
    return result;
  }

  async create(newData: CreateChuDeDto, idUser: number): Promise<any> {
    await this.syllabusService.findOne(newData.idSyllabus);
    await this.loaiKeHoachGiangDayService.findById(newData.idLKHGD);

    if (await this.isExist(null, newData)) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }
    const chuDe = await this.createEntity(new ChuDeEntity(), newData);

    try {
      const saved = await this.chuDeRepository.save({
        ...chuDe,
        createdBy: idUser,
        updatedBy: idUser,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return saved;
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.CREATE_CHUDE_FAILED);
    }
  }

  async update(id: number, newData: UpdateChuDeDTO, idUser: number): Promise<any> {
    const oldData = await this.findOne(id);

    if (newData.idSyllabus) await this.syllabusService.findOne(newData.idSyllabus);
    if (newData.idLKHGD) await this.loaiKeHoachGiangDayService.findById(newData.idLKHGD);

    if (await this.isExist(oldData, newData)) {
      throw new ConflictException(CHUDE_MESSAGE.CHUDE_EXIST);
    }
    const chuDe = await this.createEntity(oldData, newData);
    try {
      return await this.chuDeRepository.save({
        ...chuDe,
        updatedAt: new Date(),
        updatedBy: idUser
      });
    } catch (error) {
      throw new InternalServerErrorException(CHUDE_MESSAGE.UPDATE_CHUDE_FAILED);
    }
  }

  async delete(id: number, updatedBy?: number): Promise<any> {
    const chude = await this.chuDeRepository.findOne({ id, isDeleted: false });
    if (!chude) {
      throw new NotFoundException(CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND);
    }
    try {
      return await this.chuDeRepository.save({
        ...chude,
        isDeleted: true,
        updatedAt: new Date(),
        updatedBy
      });
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
    const queryCheckUnique: ChuDeEntity = { ma, idLKHGD, idSyllabus, tuan };
    const query = {
      isDeleted: false,
      ...queryCheckUnique,
      ...notID
    };
    const result = await this.chuDeRepository.findOne({ where: query });
    return result ? true : false;
  }
  private async createEntity(chuDe: ChuDeEntity, newData: CreateChuDeDto): Promise<ChuDeEntity> {
    const { chuanDauRaMonHoc, hoatDongDanhGia, hoatDongDayHoc } = newData;
    const dataUpdate = { chuanDauRaMonHoc, hoatDongDanhGia, hoatDongDayHoc };
    for (const key in dataUpdate) {
      if (Object.prototype.hasOwnProperty.call(dataUpdate, key)) {
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
        //chưa xong
        if (dataUpdate[key]) {
          for (const idCDRMH of dataUpdate[key]) {
            if (uniqueId.indexOf(idCDRMH) === -1) {
              uniqueId.push(idCDRMH);
              if (arrId.indexOf(idCDRMH) === -1) {
                const service = this.getService(key);
                const result = await service.findOne(Number(idCDRMH));
                chuDe[key].push(result);
              }
            }
          }
          delete newData[key];
        }
      }
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        chuDe[KEY_CD[key]] = newData[key];
      }
    }
    return chuDe;
  }
  private getService(key: string) {
    switch (key) {
      case 'chuanDauRaMonHoc':
        return this.chuanDauRaMonHocService;
      case 'hoatDongDanhGia':
        return this.hoatDongDanhGiaService;
      case 'hoatDongDayHoc':
        return this.hoatDongDayHocService;
    }
  }
}
