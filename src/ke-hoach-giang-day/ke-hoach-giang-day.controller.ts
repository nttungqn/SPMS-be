import {
  Body,
  Controller,
  Delete,
  Get,
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
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { CreateKeHoachGiangDayDto } from './dto/createKeHoachGiangDay.dto';
import { FilterKeHoachGiangDayDto } from './dto/filterKeHoachGiangDay.dto';
import { KeHoachGiangDayService } from './ke-hoach-giang-day.service';
import * as lodash from 'lodash';
import { KEHOACHGIANGDAY_MESSAGE } from 'constant/constant';

@ApiTags('ke-hoach-giang-day')
@Controller('ke-hoach-giang-day')
export class KeHoachGiangDayController {
  constructor(private readonly keHoachGiangDayService: KeHoachGiangDayService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterKeHoachGiangDayDto): Promise<any> {
    return await this.keHoachGiangDayService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.keHoachGiangDayService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateKeHoachGiangDayDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.keHoachGiangDayService.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.CREATED)
      .json({ message: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateKeHoachGiangDayDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.keHoachGiangDayService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.keHoachGiangDayService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }
}
