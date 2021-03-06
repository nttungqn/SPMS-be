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
import { ChiTietKeHoachService } from './chi-tiet-ke-hoach.service';
import { CreateChiTietKeHoachDto } from './dto/create-chi-tiet-ke-hoach.dto';
import { UpdateChiTietKeHoachDto } from './dto/update-chi-tiet-ke-hoach.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BaseFilterDto } from './dto/filter-chi-tiet-ke-hoach.dto';
import { RESPONSE_MESSAGE } from 'constant/constant';

@ApiTags('chi-tiet-ke-hoach')
@Controller('chi-tiet-ke-hoach')
export class ChiTietKeHoachController {
  constructor(private readonly chiTietKeHoachService: ChiTietKeHoachService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.chiTietKeHoachService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietKeHoachService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body() createMucTieuMonHocDto: CreateChiTietKeHoachDto, @Req() req) {
    const user = req.user || {};
    await this.chiTietKeHoachService.create({ ...createMucTieuMonHocDto, updatedBy: user?.id, createdBy: user?.id });
    return new HttpException(RESPONSE_MESSAGE.SUCCESS, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChiTietKeHoachDto: UpdateChiTietKeHoachDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.chiTietKeHoachService.update(id, {
      ...updateChiTietKeHoachDto,
      updatedAt: new Date(),
      updatedBy: user?.id
    });
    return new HttpException(RESPONSE_MESSAGE.SUCCESS, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.chiTietKeHoachService.remove(id, user?.id);
    return new HttpException(RESPONSE_MESSAGE.SUCCESS, HttpStatus.OK);
  }
}
