import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MonHocService } from './mon-hoc.service';
import { CreateMonHocDto } from './dto/createMonHoc';
import { FilterMonHoc } from './dto/filterMonHoc.dto';
import { IdDto } from './dto/Id.dto';

@ApiTags('mon-hoc')
@Controller('mon-hoc')
export class MonHocController {
  constructor(private readonly monHocService: MonHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async getAll(@Req() req, @Res() res, @Query() filter: FilterMonHoc) {
    const { status, data } = await this.monHocService.findAll(filter);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async getById(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const { status, data } = await this.monHocService.findById(Number(id));
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Res() res, @Body() newData: CreateMonHocDto) {
    const { status, data } = await this.monHocService.create(newData);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Res() res, @Param() param: IdDto, @Body() updatedData: CreateMonHocDto) {
    const { id } = param;
    const { status, data } = await this.monHocService.update(Number(id), updatedData);
    return res.status(status).json(data);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const { status, data } = await this.monHocService.delete(Number(id));
    return res.status(status).json(data);
  }
}
