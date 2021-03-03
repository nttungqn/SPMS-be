import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { MonHocService } from 'mon-hoc/mon-hoc.service';
import { NamHocService } from 'nam-hoc/nam-hoc.service';
import { HeDaotaoService } from 'he-dao-tao/he-dao-tao.service';
import { Not, Repository } from 'typeorm';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { GetSyllabusFilterDto } from './dto/filter-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';

@Injectable()
export class SyllabusService {
  constructor(
    @InjectRepository(Syllabus)
    private syllabusRepository: Repository<Syllabus>,
    private readonly shoolYearService: NamHocService,
    private readonly typeOfEduService: HeDaotaoService,
    private readonly subjectService: MonHocService
  ) {}

  async create(createSyllabus: CreateSyllabusDto): Promise<Syllabus> {
    if (await this.isExist(createSyllabus)) {
      throw new ConflictException();
    }

    await this.shoolYearService.findById(createSyllabus.namHoc);
    await this.typeOfEduService.findById(createSyllabus.heDaoTao);
    await this.subjectService.findById(createSyllabus.monHoc);

    try {
      const syllabus = await this.syllabusRepository.save(createSyllabus);
      return syllabus;
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }
  }

  async findAll(filter: GetSyllabusFilterDto): Promise<Syllabus[] | any> {
    const { search, page = 0, limit = LIMIT } = filter;
    const skip = page * limit;
    const query = this.syllabusRepository
      .createQueryBuilder('sy')
      .leftJoinAndSelect('sy.monHoc', 'monHoc')
      .where((qb) => {
        search
          ? qb.where('(monHoc.TenTiengViet LIKE :search OR monHoc.TenTiengAnh LIKE :search)', {
              search: `%${search}%`
            })
          : {};
      })
      .leftJoinAndSelect('sy.createdBy', 'createdBy')
      .leftJoinAndSelect('sy.heDaoTao', 'heDaoTao')
      .leftJoinAndSelect('sy.updateBy', 'updateBy')
      .leftJoinAndSelect('sy.namHoc', 'namHoc')
      .andWhere('sy.isDeleted=:isDeleted', { isDeleted: false })
      .take(limit)
      .skip(skip);
    const [results, total] = await query.getManyAndCount();
    return { contents: results, total, page: page };
  }

  async findOne(id: number): Promise<Syllabus> {
    const found = await this.syllabusRepository.findOne(id, {
      relations: ['createdBy', 'namHoc', 'heDaoTao', 'updateBy', 'monHoc'],
      where: { isDeleted: false }
    });
    if (!found) {
      throw new NotFoundException(`id:'${id}' Syllabus not found`);
    }
    return found;
  }

  async update(id: number, updateSyllabus: UpdateSyllabusDto) {
    const sylabus = await this.syllabusRepository.findOne(id, { where: { isDeleted: false } });
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
      throw new ConflictException();
    }
    try {
      await this.syllabusRepository.save({ ...sylabus, updateBy: updateSyllabus.updateBy, updatedAt: new Date() });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return this.findOne(sylabus.id);
  }

  async remove(id: number, idUser: number) {
    const found = await this.findOne(id);
    try {
      return await this.syllabusRepository.save({ ...found, updateBy: idUser, updatedAt: new Date(), isDeleted: true });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async isExist(createSyllabusDto: CreateSyllabusDto): Promise<boolean> {
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
