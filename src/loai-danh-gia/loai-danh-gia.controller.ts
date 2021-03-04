import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { LoaiDanhGiaService } from './loai-danh-gia.service';
import { CreateLoaiDanhGiaDto } from './dto/create-loai-danh-gia.dto';
import { UpdateLoaiDanhGiaDto } from './dto/update-loai-danh-gia.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterLoaiDanhGia } from './dto/filter-loai-danh-gia.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('loai-danh-gia')
@Controller('loai-danh-gia')
export class LoaiDanhGiaController {
  constructor(private readonly loaiDanhGiaService: LoaiDanhGiaService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createLoaiDanhGiaDto: CreateLoaiDanhGiaDto, @Req() req) {
    const user = req.user || {};
    await this.loaiDanhGiaService.create({ ...createLoaiDanhGiaDto, updatedBy: user?.ID, createdBy: user?.ID });
    return new HttpException('OK', HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: FilterLoaiDanhGia) {
    return this.loaiDanhGiaService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loaiDanhGiaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateLoaiDanhGiaDto: UpdateLoaiDanhGiaDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.loaiDanhGiaService.update(id, { ...updateLoaiDanhGiaDto, updatedBy: user?.ID, updatedAt: new Date() });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.loaiDanhGiaService.remove(id, user?.ID);
    return new HttpException('OK', HttpStatus.OK);
  }
}
