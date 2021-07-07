import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FilterBloomV2 } from './dto/filter-bloom.dto';
import { BloomV2Entity } from './entity/bloom-v2.entity';

@Injectable()
export class BloomV2Service {
  constructor(
    @InjectRepository(BloomV2Entity)
    private bloomRepository: Repository<BloomV2Entity>
  ) {}
  async findAll(filter:FilterBloomV2) {
    if(filter?.mucDo === undefined){
      return await this.bloomRepository.find();
    }
    if(Array.isArray(filter)){
      return await this.bloomRepository.find({ where: { levelEng: In(filter.mucDo) } });
    }else{
      return await this.bloomRepository.find({ where: { levelEng: filter.mucDo[0] } });
    }
  }
}
