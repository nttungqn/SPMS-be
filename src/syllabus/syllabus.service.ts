import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';

@Injectable()
export class SyllabusService {

  constructor(
    @InjectRepository(Syllabus)
    private syllabusRepository: Repository<Syllabus>)
    {}

  async create(createSyllabusDto: CreateSyllabusDto) :Promise<Syllabus> {
    try {
      const syllabus:Syllabus= await this.syllabusRepository.save(createSyllabusDto); 
      return syllabus;
    } catch (error) {
      throw new BadRequestException(error.sqlMessage);
    }
  }

  async findAll():Promise<Syllabus[]> {
    return await this.syllabusRepository.find({relations:["author","schoolYear","typeOfEdu"]});
  }

  async findOne(id: number):Promise<Syllabus> {
    return await this.syllabusRepository.findOne(id,{relations:["author","schoolYear","typeOfEdu"]});
  }

  update(id: number, updateSyllabusDto: UpdateSyllabusDto) {
    return `This action updates a #${id} syllabus`;
  }

  remove(id: number) {
    return `This action removes a #${id} syllabus`;
  }
  
}
