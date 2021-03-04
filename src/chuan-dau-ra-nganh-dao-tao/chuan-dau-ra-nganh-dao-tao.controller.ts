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
import { ChuanDauRaNganhDaoTaoService } from './chuan-dau-ra-nganh-dao-tao.service';
import { CreateChuanDauRaNganhDaoTaoDto } from './dto/createChuanDauRaNDT.dto';
import { FilterChuanDauRaNganhDaoTaoDto } from './dto/filterChuanDauRaNDT.dto';
import * as lodash from 'lodash';
import { CHUANDAURA_NGANHDAOTAO_MESSAGE } from 'constant/constant';

@ApiTags('chuan-dau-ra-nganh-dao-tao')
@Controller('chuan-dau-ra-nganh-dao-tao')
export class ChuanDauRaNganhDaoTaoController {
  constructor(private readonly chuanDauRaNganhDaoTaoService: ChuanDauRaNganhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChuanDauRaNganhDaoTaoDto): Promise<any> {
    return await this.chuanDauRaNganhDaoTaoService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateChuanDauRaNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.chuanDauRaNganhDaoTaoService.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_NGANHDAOTAO_MESSAGE.CREATE_CHUANDAURA_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.CREATED)
      .json({ message: CHUANDAURA_NGANHDAOTAO_MESSAGE.CREATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateChuanDauRaNganhDaoTaoDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chuanDauRaNganhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_NGANHDAOTAO_MESSAGE.UPDATE_CHUANDAURA_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: CHUANDAURA_NGANHDAOTAO_MESSAGE.UPDATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chuanDauRaNganhDaoTaoService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUANDAURA_NGANHDAOTAO_MESSAGE.DELETE_CHUANDAURA_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: CHUANDAURA_NGANHDAOTAO_MESSAGE.DELETE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY });
  }
}
