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
import { Not, QueryFailedError, Repository } from 'typeorm';
import { CreateMonHocTienQuyetDto } from './dto/create-mon-hoc-tien-quyet.dto';
import { FilterMonHocKienQuyet } from './dto/filter-mon-hoc-tien-quyet.dto';
import { UpdateMonHocKienQuyetDto } from './dto/update-mon-hoc-tien-quyet.dto';
import { MonHocTienQuyetEntity } from './entity/mon-hoc-tien-quyet.entity';

@Injectable()
export class MonHocTienQuyetService {
  constructor(
    @InjectRepository(MonHocTienQuyetEntity)
    private prerequisiteSubjectRepository: Repository<MonHocTienQuyetEntity>
  ) {}

  async create(createPrerequisiteSubjectDto: CreateMonHocTienQuyetDto) {
    if (await this.isExist(createPrerequisiteSubjectDto)) {
      throw new ConflictException();
    }
    try {
      const newRow = await this.prerequisiteSubjectRepository.create(createPrerequisiteSubjectDto);
      const result = await this.prerequisiteSubjectRepository.save(newRow);
      return await this.findById(result.id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException();
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(filter: FilterMonHocKienQuyet) {
    const { page = 0, limit = LIMIT } = filter;
    const skip = page * limit;
    const query = {
      isDeleted: false
    };
    const [results, total] = await this.prerequisiteSubjectRepository.findAndCount({
      relations: ['preSubject', 'subject', 'createdBy', 'updatedBy'],
      where: query,
      skip,
      take: limit
    });
    return { contents: results, total, page: Number(page) };
  }
  async findById(id: number) {
    const result = await this.prerequisiteSubjectRepository.findOne(id, {
      relations: ['preSubject', 'subject', 'createdBy', 'updatedBy'],
      where: { isDeleted: false }
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async findAllPrereSuject(id: number, filter: FilterMonHocKienQuyet) {
    const { page = 0, limit = LIMIT, type } = filter;
    const skip = page * limit;
    const queryByType = type ? { condition: Number(type) } : {};
    const queryByIdSubject = id ? { subject: id } : {};
    const query = {
      isDeleted: false,
      ...queryByIdSubject,
      ...queryByType
    };
    const [results, total] = await this.prerequisiteSubjectRepository.findAndCount({
      relations: ['preSubject', 'subject', 'createdBy', 'updatedBy'],
      where: query,
      skip,
      take: limit
    });
    return { contents: results, total, page: Number(page) };
  }

  async update(id: number, updatePrerequisiteSubjectDto: UpdateMonHocKienQuyetDto) {
    const newPrere = await this.prerequisiteSubjectRepository.findOne(id, { where: { isDeleted: false } });
    if (!newPrere) throw new NotFoundException();
    const { monHoc, monHocTruoc, loaiMonHoc } = updatePrerequisiteSubjectDto;
    if (monHoc) {
      newPrere.monHoc = monHoc;
    }
    if (monHocTruoc) {
      newPrere.monHocTruoc = monHocTruoc;
    }
    if (loaiMonHoc) {
      newPrere.loaiMonHoc = loaiMonHoc;
    }
    if (await this.isExist(newPrere)) {
      throw new ConflictException();
    }
    try {
      newPrere.updatedAt = new Date();
      newPrere.updatedBy = updatePrerequisiteSubjectDto.updatedBy;
      await this.prerequisiteSubjectRepository.save(newPrere);
      return this.findById(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, updateBy: number) {
    const found = await this.prerequisiteSubjectRepository.findOne(id, { where: { isDeleted: false } });
    if (!found) throw new NotFoundException();
    found.updatedBy = updateBy;
    found.updatedAt = new Date();
    found.isDeleted = true;
    try {
      await this.prerequisiteSubjectRepository.save(found);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new HttpException('OK', HttpStatus.OK);
  }

  private async isExist(prere: MonHocTienQuyetEntity): Promise<boolean> {
    const { id, monHoc, monHocTruoc } = prere;
    const notID = id ? { id: Not(id) } : {};
    const query = {
      isDeleted: false,
      monHoc,
      monHocTruoc,
      ...notID
    };
    const found = await this.prerequisiteSubjectRepository.findOne({ where: query });
    return found ? true : false;
  }
}
