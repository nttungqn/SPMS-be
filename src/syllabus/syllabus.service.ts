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
import { SchoolYearService } from 'school-year/school-year.service';
import { TypeOfEducationService } from 'type-of-education/type-of-education.service';
import { Repository } from 'typeorm';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { GetSyllabusFilterDto } from './dto/filter-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';

@Injectable()
export class SyllabusService {
  constructor(
    @InjectRepository(Syllabus)
    private syllabusRepository: Repository<Syllabus>,
    private readonly shoolYearService: SchoolYearService,
    private readonly typeOfEduService: TypeOfEducationService,
    private readonly subjectService: MonHocService
  ) {}

  async create(idUser: number, createSyllabus: CreateSyllabusDto): Promise<Syllabus> {
    if (await this.isExist(createSyllabus)) {
      throw new ConflictException();
    }

    await this.shoolYearService.findById(createSyllabus.schoolYear);
    await this.typeOfEduService.findById(createSyllabus.typeOfEdu);
    await this.subjectService.findById(createSyllabus.subject);

    try {
      createSyllabus.author = idUser;
      createSyllabus.createdAt = new Date();
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
      .leftJoinAndSelect('sy.subject', 'subject')
      .where((qb) => {
        search
          ? qb.where('(subject.TenTiengViet LIKE :search OR subject.TenTiengAnh LIKE :search)', {
              search: `%${search}%`
            })
          : {};
      })
      .leftJoinAndSelect('sy.author', 'author')
      .leftJoinAndSelect('sy.typeOfEdu', 'typeOfEdu')
      .leftJoinAndSelect('sy.updateBy', 'updateBy')
      .leftJoinAndSelect('sy.schoolYear', 'schoolYear')
      .andWhere('sy.isDeleted=:isDeleted', { isDeleted: false })
      .take(limit)
      .skip(skip);
    const [results, total] = await query.getManyAndCount();
    return { contents: results, total, page: page };
  }

  async findOne(id: number): Promise<Syllabus> {
    const found = await this.syllabusRepository.findOne(id, {
      relations: ['author', 'schoolYear', 'typeOfEdu', 'updateBy', 'subject'],
      where: { isDeleted: false }
    });
    if (!found) {
      throw new NotFoundException(`id:'${id}' Syllabus not found`);
    }
    return found;
  }

  async update(id: number, idUser: number, updateSyllabus: UpdateSyllabusDto) {
    const sylabus = await this.syllabusRepository.findOne(id, { where: { isDeleted: false } });
    sylabus.updateBy = idUser;
    const { schoolYear, typeOfEdu, subject } = updateSyllabus;
    if (schoolYear) {
      await this.shoolYearService.findById(schoolYear);
      sylabus.schoolYear = schoolYear;
    }

    if (typeOfEdu) {
      await this.typeOfEduService.findById(typeOfEdu);
      sylabus.typeOfEdu = typeOfEdu;
    }
    if (subject) {
      await this.subjectService.findById(subject);
      sylabus.subject = subject;
    }

    if (await this.isExist(sylabus)) {
      throw new ConflictException();
    }
    try {
      sylabus.updatedAt = new Date();
      await this.syllabusRepository.save(sylabus);
      return this.findOne(sylabus.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const found = await this.findOne(id);
    try {
      found.isDeleted = true;
      await this.syllabusRepository.save(found);
      return new HttpException('OK', HttpStatus.OK);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async isExist(createSyllabusDto: CreateSyllabusDto): Promise<boolean> {
    const { schoolYear, subject, typeOfEdu } = createSyllabusDto;
    const found = await this.syllabusRepository.findOne({
      where: { schoolYear, subject, typeOfEdu, isDeleted: false }
    });
    return found ? true : false;
  }
}
