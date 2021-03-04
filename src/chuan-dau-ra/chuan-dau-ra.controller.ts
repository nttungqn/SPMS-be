import { Delete, HttpStatus } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { CHUANDAURA_MESSAGE } from 'constant/constant';
import { ChuanDauRaService } from './chuan-dau-ra.service';
import { CreateChuanDauRaDto } from './dto/createChuanDauRa.dto';
import { FilterChuanDauRaDto } from './dto/filterChuanDauRa.dto';
import * as lodash from 'lodash';

@ApiTags('chuan-dau-ra')
@Controller('chuan-dau-ra')
export class ChuanDauRaController {
  constructor(private readonly chuanDauRaService: ChuanDauRaService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChuanDauRaDto): Promise<any> {
    return await this.chuanDauRaService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chuanDauRaService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateChuanDauRaDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.chuanDauRaService.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_MESSAGE.CREATE_CHUANDAURA_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.CREATED).json({ message: CHUANDAURA_MESSAGE.CREATE_CHUANDAURA_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateChuanDauRaDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chuanDauRaService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_MESSAGE.UPDATE_CHUANDAURA_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUANDAURA_MESSAGE.UPDATE_CHUANDAURA_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chuanDauRaService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_MESSAGE.DELETE_CHUANDAURA_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUANDAURA_MESSAGE.DELETE_CHUANDAURA_SUCCESSFULLY });
  }
}
