import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT, SYLLABUS_MESSAGE } from 'constant/constant';
import { MonHocService } from 'mon-hoc/mon-hoc.service';
import { NamHocService } from 'nam-hoc/nam-hoc.service';
import { HeDaotaoService } from 'he-dao-tao/he-dao-tao.service';
import { Not, OrderByCondition, Repository } from 'typeorm';
import { GetSyllabusFilterDto } from './dto/filter-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';
import { BaseService } from 'guards/base-service.dto';

@Injectable()
export class SyllabusService extends BaseService {
  constructor(
    @InjectRepository(Syllabus)
    private syllabusRepository: Repository<Syllabus>,
    private readonly shoolYearService: NamHocService,
    private readonly typeOfEduService: HeDaotaoService,
    private readonly subjectService: MonHocService
  ) {
    super();
  }

  async create(createSyllabus: Syllabus): Promise<Syllabus> {
    if (await this.isExist(createSyllabus)) {
      throw new ConflictException(SYLLABUS_MESSAGE.SYLLABUS_EXIST);
    }

    await this.shoolYearService.findById(createSyllabus.namHoc);
    await this.typeOfEduService.findById(createSyllabus.heDaoTao);
    await this.subjectService.findById(createSyllabus.monHoc);

    try {
      const syllabus = await this.syllabusRepository.save(createSyllabus);
      return syllabus;
    } catch (error) {
      throw new InternalServerErrorException(SYLLABUS_MESSAGE.CREATE_SYLLABUS_FAILED);
    }
  }

  async findAll(filter: GetSyllabusFilterDto): Promise<Syllabus[] | any> {
    const { key, page = 0, limit = LIMIT, updatedAt, createdBy, idHeDaotao, idMonHoc, idNamHoc } = filter;
    const skip = page * limit;
    const queryOrder: OrderByCondition = updatedAt ? { 'sy.updatedAt': updatedAt } : {};
    const isDeleted = false;
    const queryByCondition = `sy.isDeleted = ${isDeleted}`;
    const queryByIDNamHoc = idNamHoc ? { namHoc: idNamHoc } : {};
    const queryByIDHeDaoTao = idHeDaotao ? { heDaoTao: idHeDaotao } : {};
    const queryByIDMonHoc = idMonHoc ? { monHoc: idMonHoc } : {};
    const query = this.syllabusRepository
      .createQueryBuilder('sy')
      .leftJoinAndSelect('sy.monHoc', 'monHoc')
      .leftJoinAndSelect('sy.createdBy', 'createdBy')
      .where((qb) => {
        key
          ? qb.where('(monHoc.TenTiengViet LIKE :key OR monHoc.TenTiengAnh LIKE :key)', {
              key: `%${key}%`
            })
          : {};
        createdBy ? qb.andWhere('createdBy.id =:idUser', { idUser: createdBy }) : {};
      })
      .where({
        ...queryByIDHeDaoTao,
        ...queryByIDMonHoc,
        ...queryByIDNamHoc
      })
      .leftJoinAndSelect('sy.heDaoTao', 'heDaoTao')
      .leftJoinAndSelect('sy.updatedBy', 'updatedBy')
      .leftJoinAndSelect('sy.namHoc', 'namHoc')
      .andWhere(queryByCondition)
      .take(limit)
      .skip(skip)
      .orderBy({ ...queryOrder });
    const [results, total] = await query.getManyAndCount();
    return { contents: results, total, page: Number(page) };
  }

  async findOne(id: number): Promise<Syllabus> {
    const found = await this.syllabusRepository.findOne(id, {
      relations: ['createdBy', 'namHoc', 'heDaoTao', 'updatedBy', 'monHoc'],
      where: { isDeleted: false }
    });
    if (!found) {
      throw new NotFoundException(SYLLABUS_MESSAGE.SYLLABUS_ID_NOT_FOUND);
    }
    return found;
  }

  async update(id: number, updateSyllabus: Syllabus) {
    const sylabus = await this.syllabusRepository.findOne(id, { where: { isDeleted: false } });
    this.isOwner(sylabus.createdBy, updateSyllabus.updatedBy);
    const { namHoc, heDaoTao, monHoc } = updateSyllabus;
    if (namHoc) {
      await this.shoolYearService.findById(namHoc);
      sylabus.namHoc = namHoc;
    }
    if (heDaoTao) {
      await this.typeOfEduService.findById(heDaoTao);
      sylabus.heDaoTao = heDaoTao;
    }
    if (monHoc) {
      await this.subjectService.findById(monHoc);
      sylabus.monHoc = monHoc;
    }

    if (await this.isExist(sylabus)) {
      throw new ConflictException(SYLLABUS_MESSAGE.SYLLABUS_EXIST);
    }
    try {
      await this.syllabusRepository.save({ ...sylabus, updateBy: updateSyllabus.updatedBy, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException(SYLLABUS_MESSAGE.UPDATE_SYLLABUS_FAILED);
    }
    return this.findOne(sylabus.id);
  }

  async remove(id: number, idUser: number) {
    const found = await this.findOne(id);
    this.isOwner(found.createdBy, idUser);
    try {
      return await this.syllabusRepository.save({ ...found, updateBy: idUser, updatedAt: new Date(), isDeleted: true });
    } catch (error) {
      throw new InternalServerErrorException(SYLLABUS_MESSAGE.DELETE_SYLLABUS_FAILED);
    }
  }

  async getCountSyllabus(idUser?: number): Promise<number> {
    if (idUser) {
      return await this.syllabusRepository.count({ createdBy: idUser, isDeleted: false });
    }
    return await this.syllabusRepository.count({ isDeleted: false });
  }
  async isExist(createSyllabusDto: Syllabus): Promise<boolean> {
    const { id, namHoc, monHoc, heDaoTao } = createSyllabusDto;
    const isNotId = id ? { id: Not(id) } : {};
    const query = {
      namHoc,
      monHoc,
      heDaoTao,
      isDeleted: false,
      ...isNotId
    };
    const found = await this.syllabusRepository.findOne({
      where: query
    });
    return found ? true : false;
  }
}
