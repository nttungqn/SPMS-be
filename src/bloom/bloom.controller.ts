import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BloomService } from './bloom.service';
import { FilterBloom } from './dto/filter-bloom.dto';

@ApiTags('bloom')
@Controller('bloom')
export class BloomController {
  constructor(private readonly bloomService: BloomService) {}

  @Get()
  findAll(@Query() filter: FilterBloom) {
    return this.bloomService.findAll(filter);
  }
}
