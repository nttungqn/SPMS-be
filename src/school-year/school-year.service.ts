import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYear } from './entity/school-year.entity';

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearRepository:Repository<SchoolYear>,
  ){}
  async create(createSchoolYearDto: CreateSchoolYearDto) :Promise<SchoolYear>{
    if(await this.isContainSchoolYear(createSchoolYearDto)){
      throw new ConflictException();
    }
    try {
      return await this.schoolYearRepository.save(createSchoolYearDto);
    } catch (error) {
     throw new ServiceUnavailableException(); 
    }
  }

  async findAll() {
    return await this.schoolYearRepository.find({where:{isDeleted:false},order:{code:'ASC'}});
  }

  async findById(id: number):Promise<SchoolYear> {
    let found;
    try {
       found= await this.schoolYearRepository.findOne(id,{where:{isDeleted:false}});
    } catch (error) {
     throw new ServiceUnavailableException(); 
    }
    if(!found){
      throw new NotFoundException(`id: ${id} not found`);
    }
    return found;
  }

  async update(id: number, updateSchoolYearDto: UpdateSchoolYearDto) {
    const found= await this.findById(id);
    console.log(found);
    await this.checkConflictException(id,updateSchoolYearDto);
    try {
      return await this.schoolYearRepository.save({...found,...updateSchoolYearDto});
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException();
    }
  
  }

  async remove(id: number) {
    const found= await this.findById(id);
    found.isDeleted=true;
    try {
     await this.schoolYearRepository.save(found);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  private async isContainSchoolYear(createSchoolYearDto:CreateSchoolYearDto):Promise<boolean>{
    const {code,name}=createSchoolYearDto;
    const found=await this.schoolYearRepository.findOne({where:
      [{code:code,isDeleted:false},{name:name,isDeleted:false}]
    })
    return found?true:false;
  }
  private async checkConflictException(id:number, updateSchoolYearDto: UpdateSchoolYearDto){
    const {code,name}=updateSchoolYearDto;
    const query =this.schoolYearRepository.createQueryBuilder('sy');
    query.andWhere('(sy.code=:code OR sy.name=:name)',{code,name});
    query.andWhere('(sy.isDeleted=:isDeleted AND sy.id!=:id)',{isDeleted:false,id});
    const found=await query.getOne();
    if(found){
      throw new ConflictException();
    }
  }
}
