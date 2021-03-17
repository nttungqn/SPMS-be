import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CHUANDAURAMONHOC_MESSAGE, LIMIT } from 'constant/constant';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { MucTieuMonHocService } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.service';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Repository } from 'typeorm';
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

  create(createChuanDauRaMonHocDto: CreateChuanDauRaMonHocDto, idUser: number) {
    return 'This action adds a new chuanDauRaMonHoc';
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

  update(id: number, updateChuanDauRaMonHocDto: UpdateChuanDauRaMonHocDto) {
    return `This action updates a #${id} chuanDauRaMonHoc`;
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
}
