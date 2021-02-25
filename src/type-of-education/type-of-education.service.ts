import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import { CreateTypeOfEducationDto } from './dto/create-type-of-education.dto';
import { UpdateTypeOfEducationDto } from './dto/update-type-of-education.dto';
import { TypeOfEducation } from './entity/type-of-education.entity';

@Injectable()
export class TypeOfEducationService {
  constructor(
    @InjectRepository(TypeOfEducation)
    private typeOfEduRepository:Repository<TypeOfEducation>,
  ){}

  async create(createTypeOfEducationDto: CreateTypeOfEducationDto) {
    if(await this.isExist(createTypeOfEducationDto)){
      throw new ConflictException();
    }
    try {
      return await this.typeOfEduRepository.save(createTypeOfEducationDto);
    } catch (error) {
     throw new ServiceUnavailableException(); 
    }
  }

  async findAll() {
    return await this.typeOfEduRepository.find({where:{isDeleted:false},order:{code:'ASC'}});
  }

  async findById(id: number):Promise<TypeOfEducation> {
    let found;
    try {
       found= await this.typeOfEduRepository.findOne(id,{where:{isDeleted:false}});
    } catch (error) {
     throw new ServiceUnavailableException(); 
    }
    if(!found){
      throw new NotFoundException(`id: ${id} not found`);
    }
    return found;
  }

  async update(id: number, updateTypeOfEducationDto: UpdateTypeOfEducationDto) {
    const found= await this.findById(id);
    await this.checkConflictException(id,updateTypeOfEducationDto);
    try {
      return await this.typeOfEduRepository.save({...found,...updateTypeOfEducationDto});
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async remove(id: number) {
    const found= await this.findById(id);
    found.isDeleted=true;
    try {
     await this.typeOfEduRepository.save(found);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
  private async isExist(createTypeOfEducationDto: CreateTypeOfEducationDto):Promise<boolean>{
    const {code,name}=createTypeOfEducationDto;
    const found=await this.typeOfEduRepository.findOne({where:
      [{code:code,isDeleted:false},{name:name,isDeleted:false}]
    })
    return found?true:false;
  }
  private async checkConflictException(id:number, createTypeOfEducationDto: CreateTypeOfEducationDto){
    const {code,name}=createTypeOfEducationDto;
    const query =this.typeOfEduRepository.createQueryBuilder('tod');
    query.andWhere('(tod.code=:code OR tod.name=:name)',{code,name});
    query.andWhere('(tod.isDeleted=:isDeleted AND tod.id!=:id)',{isDeleted:false,id});
    const found=await query.getOne();
    if(found){
      throw new ConflictException();
    }
  }
}
