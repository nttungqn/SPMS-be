import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LIMIT } from 'constant/constant';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { CreatePrerequisiteSubjectDto } from './dto/create-prerequisite-subject.dto';
import { FilterPrerequisiteSubject } from './dto/filter-prerequisite-subject.dto';
import { UpdatePrerequisiteSubjectDto } from './dto/update-prerequisite-subject.dto';
import { PrerequisiteSubject } from './entity/prerequisite-subject.entity';
import { typeCondition } from './enum/type-condition.enum';

@Injectable()
export class PrerequisiteSubjectService {
  constructor(
    @InjectRepository(PrerequisiteSubject)
    private prerequisiteSubjectRepository: Repository<PrerequisiteSubject>
  ) { }

  async create(createPrerequisiteSubjectDto: CreatePrerequisiteSubjectDto) {
    if(await this.isExist(createPrerequisiteSubjectDto)){
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

  async findAll(filter: FilterPrerequisiteSubject) {
    const { page = 0, limit = LIMIT } = filter;
    const skip = page * limit;
    const query={
      isDeleted:false
    }
    const results = await this.prerequisiteSubjectRepository.find({ relations: ['preSubject', 'subject', 'createdBy', 'updatedBy'], where: query,skip,take:limit });
    const total = await this.prerequisiteSubjectRepository.count({ ...query });
    return { contents: results, total, page: Number(page) };
  }
  async findById(id: number) {
    const result = await this.prerequisiteSubjectRepository.findOne(id, { relations: ['preSubject', 'subject', 'createdBy', 'updatedBy'], where: { isDeleted: false } });
    if (!result)
      throw new NotFoundException();
    return result;
  }
  async findAllPrevSuject(id: number) {
    return await this.prerequisiteSubjectRepository.find({ relations: ['preSubject', 'createdBy', 'updatedBy'], where: { subject: id, condition: typeCondition.PREVIOUS, isDeleted: false } });
  }

  async findAllParaSuject(id: number) {
    return await this.prerequisiteSubjectRepository.find({ relations: ['preSubject', 'createdBy', 'updatedBy'], where: { subject: id, condition: typeCondition.PARALLEL, isDeleted: false } });
  }

  async update(id: number, updatePrerequisiteSubjectDto: UpdatePrerequisiteSubjectDto) {
    const newPrere = await this.prerequisiteSubjectRepository.findOne(id, { where: { isDeleted: false } });
    if (!newPrere)
      throw new NotFoundException();
    const { subject, preSubject, condition } = updatePrerequisiteSubjectDto;
    if (subject) {
      newPrere.subject = subject;
    }
    if (preSubject) {
      newPrere.preSubject = preSubject;
    }
    if (condition) {
      newPrere.condition = condition;
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
    if (!found)
      throw new NotFoundException();
    found.updatedBy = updateBy;
    found.updatedAt = new Date();
    found.isDeleted=true;
    try {
      await this.prerequisiteSubjectRepository.save(found);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new HttpException('OK', HttpStatus.OK);
  }

  private async isExist(prere: PrerequisiteSubject): Promise<boolean> {
    const { id,subject, preSubject } = prere;
    const notID=id?{id:Not(id)}:{};
    const query ={
      isDeleted: false,
      subject, preSubject,
      ...notID
    }
    const found = await this.prerequisiteSubjectRepository.findOne({ where: query });
    return found ? true : false;
  }
}
