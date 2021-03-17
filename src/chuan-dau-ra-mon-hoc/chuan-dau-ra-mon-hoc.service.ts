import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURAMONHOC_MESSAGE, LIMIT } from 'constant/constant';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Not, Repository } from 'typeorm';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';
import { ChuanDauRaMonHocEntity } from './entity/chuan-dau-ra-mon-hoc.entity';

@Injectable()
export class ChuanDauRaMonHocService {
  constructor(
    @InjectRepository(ChuanDauRaMonHocEntity)
    private chuanDauRaMonHocService: Repository<ChuanDauRaMonHocEntity>,
    private mucTieuMonHocService: MucTieuMonHocService,
    private syllabusService: SyllabusService
  ) {}

  async create(newData: CreateChuanDauRaMonHocDto, idUser: number) {
    await this.mucTieuMonHocService.findOne(newData.mucTieuMonHoc);

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
    const { page = 0, limit = LIMIT, idMucTieuMonHoc, idSyllabus } = filter;
    const skip = page * limit;

    if (!(idMucTieuMonHoc || idSyllabus)) {
      const [results, total] = await this.chuanDauRaMonHocService.findAndCount({
        relations: ['createdBy', 'updatedBy'],
        where: { isDeleted: false },
        skip,
        take: limit,
        order: { ma: 'ASC' }
      });
      return { contents: results, total, page: page };
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
      const [results, total] = await this.chuanDauRaMonHocService
        .createQueryBuilder('cdr')
        .leftJoin('cdr.mucTieuMonHoc', 'mtmh')
        .where(query)
        .andWhere('mtmh.isDeleted =:isDeleted', { isDeleted: false })
        .andWhere('cdr.isDeleted =:isDeleted', { isDeleted: false })
        .leftJoinAndSelect('cdr.updatedBy', 'updatedBy')
        .leftJoinAndSelect('cdr.createdBy', 'createdBy')
        .skip(skip)
        .take(limit)
        .orderBy({ 'cdr.ma': 'ASC' })
        .getManyAndCount();
      return { contents: results, total, page: page };
    }
  }

  async findOne(id: number) {
    const found = await this.chuanDauRaMonHocService.findOne(id, {
      relations: ['createdBy', 'updatedBy'],
      where: { isDeleted: false }
    });
    if (!found) {
      throw new NotFoundException(CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND);
    }
    return found;
  }

  async update(id: number, newData: UpdateChuanDauRaMonHocDto, idUser: number) {
    const oldData = await this.chuanDauRaMonHocService.findOne(id, { where: { isDeleted: false } });

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
    const queryByMaAndSlylabus: ChuanDauRaMonHocEntity = { mucTieuMonHoc, ma };
    const query = {
      isDeleted: false,
      ...queryByMaAndSlylabus,
      ...notID
    };
    const result = await this.chuanDauRaMonHocService.findOne({ where: query });
    return result ? true : false;
  }
}
