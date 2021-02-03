import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { CreateChuongTrinhDaoTaoDto } from './dto/createChuongTrinhDaoTao.dto';
import { FilterChuongTrinhDaoTao } from './dto/filterChuongTrinhDaoTao.dto';
import { IdDto } from './dto/Id.dto';

@ApiTags('chuong-trinh-dao-tao')
@Controller('chuong-trinh-dao-tao')
export class ChuongTrinhDaoTaoController {
  constructor(private readonly chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async getAll(@Req() req, @Res() res, @Query() filter: FilterChuongTrinhDaoTao) {
    const { status, data } = await this.chuongTrinhDaoTaoService.findAll(filter);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async getById(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const { status, data } = await this.chuongTrinhDaoTaoService.findById(Number(id));
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Res() res, @Body() newData: CreateChuongTrinhDaoTaoDto) {
    const { status, data } = await this.chuongTrinhDaoTaoService.create(newData);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Res() res, @Param() param: IdDto, @Body() updatedData: CreateChuongTrinhDaoTaoDto) {
    const { id } = param;
    const { status, data } = await this.chuongTrinhDaoTaoService.update(Number(id), updatedData);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const { status, data } = await this.chuongTrinhDaoTaoService.delete(Number(id));
    return res.status(status).json(data);
  }
}
