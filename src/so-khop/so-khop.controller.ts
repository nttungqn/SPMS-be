import { Controller, Get } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('so-khop')
@Controller('so-khop')
export class SoKhopController {
  constructor(private readonly soKhopService: SoKhopService) {}

  @Get('/nganh-dao-tao/:id')
  findOne() {
    return this.soKhopService.soKhopNganhDaotao();
  }
}
