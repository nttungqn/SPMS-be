import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, MUCTIEUMONHOC_MESSAGE } from 'constant/constant';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';

@Injectable()
export class MucTieuMonHocService {
  constructor(
    @InjectRepository(MucTieuMonHocEntity)
    private mucTieuMonHocEntityRepository: Repository<MucTieuMonHocEntity>,
    private syllabusService: SyllabusService
  ) {}

  async create(newData: MucTieuMonHocEntity) {
    await this.syllabusService.findOne(newData.syllabus);

    if (await this.isExist(null, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);

    try {
      const result = await this.mucTieuMonHocEntityRepository.save({
        ...newData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return this.findOne(result.id);
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async findAll(filter: FilterMucTieuMonHoc) {
    const { page = 0, limit = LIMIT, idSyllabus } = filter;
    const skip = page * limit;
    const searchByIdSyllabus = idSyllabus ? { syllabus: idSyllabus } : {};
    if (idSyllabus) await this.syllabusService.findOne(idSyllabus);
    const query: MucTieuMonHocEntity = {
      isDeleted: false,
      ...searchByIdSyllabus
    };
    const order = idSyllabus ? { ma: 'ASC' } : {};
    try {
      const [results, total] = await this.mucTieuMonHocEntityRepository.findAndCount({
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
        take: limit,
        ...order
      });
      return { contents: results, total, page: Number(page) };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    let result: any;
    try {
      result = await this.mucTieuMonHocEntityRepository.findOne(id, {
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
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    return result;
  }

  async update(id: number, newData: MucTieuMonHocEntity) {
    const oldData = await this.mucTieuMonHocEntityRepository.findOne(id, { where: { isDeleted: false } });
    if (!oldData) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    if (await this.isExist(oldData, newData)) throw new ConflictException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST);
    if (!newData.syllabus) await this.syllabusService.findOne(newData.syllabus);
    try {
      return await this.mucTieuMonHocEntityRepository.save({ ...oldData, ...newData, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_FAILED);
    }
  }

  async remove(id: number, idUser: number) {
    const result = await this.mucTieuMonHocEntityRepository.findOne(id, { where: { isDeleted: false } });
    if (!result) throw new NotFoundException(MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND);
    try {
      return await this.mucTieuMonHocEntityRepository.save({
        ...result,
        updatedAt: new Date(),
        updatedBy: idUser,
        isDeleted: true
      });
    } catch (error) {
      throw new InternalServerErrorException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_FAILED);
    }
  }

  async isExist(oldData: MucTieuMonHocEntity, newData: MucTieuMonHocEntity): Promise<boolean> {
    const { syllabus, ma }: MucTieuMonHocEntity = newData;
    if (!(syllabus || ma)) return false;
    const loaiDanhGia: MucTieuMonHocEntity = { ...oldData, ...newData };
    const queryByMaAndSlylabus: MucTieuMonHocEntity = { syllabus: loaiDanhGia.syllabus, ma: loaiDanhGia.ma };
    const notID = oldData?.id ? { id: Not(Number(oldData.id)) } : {};
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const found = await this.mucTieuMonHocEntityRepository.findOne({ where: query });
    return found ? true : false;
  }
}
