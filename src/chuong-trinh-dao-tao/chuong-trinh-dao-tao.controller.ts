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
import { CHUONGTRINHDAOTAO_MESSAGE } from 'constant/constant';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { CreateChuongTrinhDaoTaoDto } from './dto/createChuongTrinhDaoTao.dto';
import { FilterChuongTrinhDaoTao } from './dto/filterChuongTrinhDaoTao.dto';
import { IdDto } from './dto/Id.dto';
import * as lodash from 'lodash';

@ApiTags('chuong-trinh-dao-tao')
@Controller('chuong-trinh-dao-tao')
export class ChuongTrinhDaoTaoController {
  constructor(private readonly chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService) {}

  @Get()
  async getAll(@Req() req, @Query() filter: FilterChuongTrinhDaoTao) {
    return await this.chuongTrinhDaoTaoService.findAll(filter);
  }
  @Get(':id')
  async getById(@Req() req, @Param() param: IdDto) {
    const { id } = param;
    return await this.chuongTrinhDaoTaoService.findById(Number(id));
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Res() res, @Body() newData: CreateChuongTrinhDaoTaoDto) {
    const user = req.user || {};
    try {
      await this.chuongTrinhDaoTaoService.create({ ...newData, createdBy: user?.ID, updatedBy: user?.ID });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.CREATED)
      .json({ message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY });
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Res() res, @Param() param: IdDto, @Body() updatedData: CreateChuongTrinhDaoTaoDto) {
    const { id } = param;
    const user = req.user || {};
    try {
      await this.chuongTrinhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY });
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const user = req.user || {};
    try {
      await this.chuongTrinhDaoTaoService.delete(Number(id), user?.ID);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY });
  }
}
