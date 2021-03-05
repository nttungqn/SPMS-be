import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpException,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { MUCTIEUMONHOC_MESSAGE } from 'constant/constant';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mucTieuMonHocService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body() createMucTieuMonHocDto: CreateMucTieuMonHocDto, @Req() req) {
    const user = req.user || {};
    await this.mucTieuMonHocService.create({ ...createMucTieuMonHocDto, updatedBy: user?.id, createdBy: user?.id });
    return new HttpException(MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMucTieuMonHocDto: UpdateMucTieuMonHocDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.mucTieuMonHocService.update(id, {
      ...updateMucTieuMonHocDto,
      updatedBy: user?.id,
      updatedAt: new Date()
    });
    return new HttpException(MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.mucTieuMonHocService.remove(id, user?.id);
    return new HttpException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
