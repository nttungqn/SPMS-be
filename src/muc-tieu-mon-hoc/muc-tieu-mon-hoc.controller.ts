import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';

@ApiTags('muc-tieu-mon-hoc')
@Controller('muc-tieu-mon-hoc')
export class MucTieuMonHocController {
  constructor(private readonly mucTieuMonHocService: MucTieuMonHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: FilterMucTieuMonHoc) {
    return this.mucTieuMonHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mucTieuMonHocService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  create(@Body() createMucTieuMonHocDto: CreateMucTieuMonHocDto) {
    return this.mucTieuMonHocService.create(createMucTieuMonHocDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(@Param('id') id: string, @Body() updateMucTieuMonHocDto: UpdateMucTieuMonHocDto) {
    return this.mucTieuMonHocService.update(+id, updateMucTieuMonHocDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mucTieuMonHocService.remove(+id);
  }
}
