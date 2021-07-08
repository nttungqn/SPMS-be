import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BloomV2Service } from './bloom-v2.service';
import { FilterBloomV2 } from './dto/filter-bloom.dto';

@ApiTags('bloom-v2')
@Controller('bloom-v2')
export class BloomV2Controller {
  constructor(private readonly bloomV2Service: BloomV2Service) {}
  @Get()
  findAll(@Query() filter: FilterBloomV2) {
    return this.bloomV2Service.findAll(filter);
  }
}
