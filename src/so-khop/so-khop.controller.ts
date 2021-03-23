import { Controller, Get, Param, Query } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';

@ApiTags('so-khop')
@Controller('so-khop')
export class SoKhopController {
  constructor(private readonly soKhopService: SoKhopService) {}

  @Get('/nganh-dao-tao/:id')
  findOne(@Query() filter: FilterSoKhopNganhDaoTao, @Param('id') id: number) {
    return this.soKhopService.soKhopNganhDaotao(id, filter);
  }
}
