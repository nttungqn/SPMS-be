import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoaiKeHoachGiangDayService } from './loai-ke-hoach-giang-day.service';
import { CreateLoaiKeHoachGiangDayDto } from './dto/createLoaiKeHoachGiangDay.dto';
import { BaseFilterDto } from './dto/fliterLoaiKeHoachGiangDay.dto';
import { IdDto } from './dto/Id.dto';
import { LOAIKEHOACHGIANGDAY_MESSAGE } from './../constant/constant';

@ApiTags('loai-ke-hoach-giang-day')
@Controller('loai-ke-hoach-giang-day')
export class LoaiKeHoachGiangDayController {
  constructor(private readonly loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: BaseFilterDto): Promise<any> {
    return await this.loaiKeHoachGiangDayService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.loaiKeHoachGiangDayService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateLoaiKeHoachGiangDayDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.loaiKeHoachGiangDayService.create({
      ...newData,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateLoaiKeHoachGiangDayDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.loaiKeHoachGiangDayService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res
      .status(HttpStatus.OK)
      .json({ message: LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.loaiKeHoachGiangDayService.delete(Number(id), user?.ID);
    return res
      .status(HttpStatus.OK)
      .json({ message: LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY });
  }
}
