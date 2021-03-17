import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';

@ApiTags('chuan-dau-ra-mon-hoc')
@Controller('chuan-dau-ra-mon-hoc')
export class ChuanDauRaMonHocController {
  constructor(private readonly chuanDauRaMonHocService: ChuanDauRaMonHocService) {}

  @Get()
  findAll(@Query() fillter: FilterChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.findAll(fillter);
  }

  @Post()
  create(@Body() createChuanDauRaMonHocDto: CreateChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.create(createChuanDauRaMonHocDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chuanDauRaMonHocService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChuanDauRaMonHocDto: UpdateChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.update(+id, updateChuanDauRaMonHocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chuanDauRaMonHocService.remove(+id);
  }
}
