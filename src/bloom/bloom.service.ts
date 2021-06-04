import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateBloomDto } from './dto/create-bloom.dto';
import { FilterBloom } from './dto/filter-bloom.dto';
import { UpdateBloomDto } from './dto/update-bloom.dto';
import { BloomEntity } from './entity/bloom.entity';

@Injectable()
export class BloomService {
  constructor(
    @InjectRepository(BloomEntity)
    private bloomRepository: Repository<BloomEntity>
  ) {}
  async findAll(filter: FilterBloom) {
    if (filter?.mucDo?.length == 1) {
      return await this.bloomRepository.find({ where: { mucDo: filter.mucDo[0] } });
    } else if (filter?.mucDo?.length > 1) {
      return await this.bloomRepository.find({ where: { mucDo: In(filter.mucDo) } });
    } else {
      return await this.bloomRepository.find();
    }
  }
}
