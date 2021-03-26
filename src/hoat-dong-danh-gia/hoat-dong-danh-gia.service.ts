import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChuanDauRaMonHocService } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.service';
import { HOATDONGDANHGIA_MESSAGE, LIMIT } from 'constant/constant';
import { LoaiDanhGiaService } from 'loai-danh-gia/loai-danh-gia.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { CreateHoatDongDanhGiaDto } from './dto/create-hoat-dong-danh-gia.dto';
import { FilterHoatDongDanhGia } from './dto/filter-hoat-dong-danh-gia.dto';
import { UpdateHoatDongDanhGiaDto } from './dto/update-hoat-dong-danh-gia.dto';
import { HoatDongDanhGiaEntity, KeyHDDG } from './entity/hoat-dong-danh-gia.entity';

@Injectable()
export class HoatDongDanhGiaService {
  constructor(
    @InjectRepository(HoatDongDanhGiaEntity)
    private hoatDongDanhGiaService: Repository<HoatDongDanhGiaEntity>,
    private syllabusService: SyllabusService,
    private loaiDanhGiaService: LoaiDanhGiaService,
    private chuaDauRaMonHocService: ChuanDauRaMonHocService
  ) {}
  async create(newData: CreateHoatDongDanhGiaDto, idUser: number) {
    await this.findOne(newData.idLoaiDanhGia);
    if (await this.isExistV2(null, newData)) throw new ConflictException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST);
    const hoatDongDanhGia = new HoatDongDanhGiaEntity();
    const { chuanDauRaMonHoc } = newData;
    if (chuanDauRaMonHoc) {
      hoatDongDanhGia.chuanDauRaMonHoc = [];
      const uniqueId = [];
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          const result = await this.chuaDauRaMonHocService.findOne(Number(idCDRMH));
          hoatDongDanhGia.chuanDauRaMonHoc.push(result);
        }
      }
      delete newData.chuanDauRaMonHoc;
    }
    for (const key in newData) {
      if (Object.prototype.hasOwnProperty.call(newData, key)) {
        hoatDongDanhGia[KeyHDDG[key]] = newData[key];
      }
    }
    try {
      const result = await this.hoatDongDanhGiaService.save({
        ...hoatDongDanhGia,
        createdAt: new Date(),
        createdBy: idUser,
        updatedAt: new Date(),
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_FAILED);
    }
  }

  async findAll(filter: FilterHoatDongDanhGia) {
    const { page = 0, limit = LIMIT } = filter;
    const skip = page * limit;

    let query = '';
    const { idSyllabus, idLoaiDanhGia } = filter;
    if (idSyllabus) {
      await this.syllabusService.findOne(idSyllabus);
      query = `ldg.idSyllabus=${idSyllabus}`;
    }
    if (idLoaiDanhGia) {
      await this.loaiDanhGiaService.findOne(idLoaiDanhGia);
      if (idSyllabus) query += ' And ';
      query += `ldg.id=${idLoaiDanhGia}`;
    }
    const [results, total] = await this.hoatDongDanhGiaService
      .createQueryBuilder('hddg')
      .leftJoin('hddg.loaiDanhGia', 'ldg')
      .where(query ? query : {})
      .andWhere('hddg.isDeleted =:isDeleted', { isDeleted: false })
      .andWhere('ldg.isDeleted =:isDeleted', { isDeleted: false })
      .leftJoinAndSelect('hddg.updatedBy', 'updatedBy')
      .leftJoinAndSelect('hddg.createdBy', 'createdBy')
      .leftJoinAndSelect('hddg.chuanDauRaMonHoc', 'chuanDauRaMonHoc')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return { contents: results, total, page: page };
  }

  async findOne(id: number) {
    const found = await this.hoatDongDanhGiaService.findOne(id, {
      relations: ['createdBy', 'updatedBy'],
      where: { isDeleted: false }
    });
    if (!found) {
      throw new NotFoundException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_ID_NOT_FOUND);
    }
    return found;
  }

  async update(id: number, newData: UpdateHoatDongDanhGiaDto, idUser: number) {
    const oldData = await this.findOne(id);
    if (await this.isExistV2(oldData, newData))
      throw new ConflictException(HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST);
    const { chuanDauRaMonHoc } = newData;
    if (chuanDauRaMonHoc) {
      oldData.chuanDauRaMonHoc = [];
      const uniqueId = [];
      for (const idCDRMH of chuanDauRaMonHoc) {
        if (uniqueId.indexOf(idCDRMH) === -1) {
          uniqueId.push(idCDRMH);
          const result = await this.chuaDauRaMonHocService.findOne(Number(idCDRMH));
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
    try {
      const result = await this.hoatDongDanhGiaService.save({
        ...oldData,
        updatedAt: new Date(),
        updatedBy: idUser
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(HOATDONGDANHGIA_MESSAGE.UPDATE_HOATDONGDANHGIA_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const found = await this.findOne(id);
    try {
      return await this.hoatDongDanhGiaService.save({
        ...found,
        updateBy: idUser,
        updatedAt: new Date(),
        isDeleted: true
      });
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
}
