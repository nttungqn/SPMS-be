import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, LOAIDANHGIA_MESSAGE } from 'constant/constant';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { FilterLoaiDanhGia } from './dto/filter-loai-danh-gia.dto';
import { LoaiDanhGiaEntity } from './entity/loai-danh-gia.entity';

@Injectable()
export class LoaiDanhGiaService {
  constructor(
    @InjectRepository(LoaiDanhGiaEntity)
    private loaiDanhGiaRepository: Repository<LoaiDanhGiaEntity>,
    private syllabusService: SyllabusService
  ) {}

  async create(loaiDanhGiaEntity: LoaiDanhGiaEntity) {
    await this.syllabusService.findOne(loaiDanhGiaEntity.syllabus);

    if (await this.isExist(null, loaiDanhGiaEntity)) throw new ConflictException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST);

    try {
      const result = await this.loaiDanhGiaRepository.save({
        ...loaiDanhGiaEntity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_FAILED);
    }
  }

  async findAll(filter: FilterLoaiDanhGia) {
    const { page = 0, limit = LIMIT, idSyllabus } = filter;
    const skip = page * limit;
    const searchByIdSyllabus: LoaiDanhGiaEntity = idSyllabus ? { syllabus: idSyllabus } : {};
    if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
    const query: LoaiDanhGiaEntity = {
      isDeleted: false,
      ...searchByIdSyllabus
    };
    const [results, total] = await this.loaiDanhGiaRepository.findAndCount({
      relations: [
        'syllabus',
        'createdBy',
        'updatedBy',
        'syllabus.monHoc',
        'syllabus.createdBy',
        'syllabus.updatedBy',
        'syllabus.heDaoTao',
        'syllabus.namHoc'
      ],
      where: query,
      skip,
      take: limit
    });
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number) {
    let result: any;
    try {
      result = await this.loaiDanhGiaRepository.findOne(id, {
        relations: [
          'syllabus',
          'createdBy',
          'updatedBy',
          'syllabus.monHoc',
          'syllabus.createdBy',
          'syllabus.updatedBy',
          'syllabus.heDaoTao',
          'syllabus.namHoc'
        ],
        where: { isDeleted: false }
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_FAILED);
    }
    if (!result) throw new NotFoundException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND);
    return result;
  }

  async update(id: number, newData: LoaiDanhGiaEntity) {
    const oldData = await this.loaiDanhGiaRepository.findOne(id, { where: { isDeleted: false } });
    if (!oldData) throw new NotFoundException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND);
    if (await this.isExist(oldData, newData)) throw new ConflictException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST);
    if (!newData.syllabus) await this.syllabusService.findOne(newData.syllabus);
    try {
      return await this.loaiDanhGiaRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.UPDATE_LOAIDANHGIA_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.loaiDanhGiaRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND);
    try {
      return await this.loaiDanhGiaRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_FAILED);
    }
  }

  async isExist(oldData: LoaiDanhGiaEntity, newData: LoaiDanhGiaEntity): Promise<boolean> {
    const { syllabus, ma }: LoaiDanhGiaEntity = newData;
    if (!(syllabus || ma)) return false;
    const loaiDanhGia: LoaiDanhGiaEntity = { ...oldData, ...newData };
    const queryByMaAndSlylabus: LoaiDanhGiaEntity = { syllabus: loaiDanhGia.syllabus, ma: loaiDanhGia.ma };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const found = await this.loaiDanhGiaRepository.findOne({ where: query });
    return found ? true : false;
  }
}
