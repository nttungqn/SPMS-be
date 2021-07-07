import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BloomV2Service } from './bloom-v2.service';
import { CreateBloomV2Dto } from './dto/create-bloom-v2.dto';
import { FilterBloomV2 } from './dto/filter-bloom.dto';
import { UpdateBloomV2Dto } from './dto/update-bloom-v2.dto';

@Controller('bloom-v2')
export class BloomV2Controller {
  constructor(private readonly bloomV2Service: BloomV2Service) {}
  @Get()
  findAll(@Query() filter: FilterBloomV2) {
    return this.bloomV2Service.findAll(filter);
  }
}
