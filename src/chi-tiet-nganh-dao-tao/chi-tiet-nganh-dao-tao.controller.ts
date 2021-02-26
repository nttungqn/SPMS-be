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
import { CTNGANHDAOTAO_MESSAGE } from 'constant/constant';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { CreateCTNganhDaoTaoDto } from './dto/createCTNganhDaoTao.dto';
import { FilterCTNganhDaoTaoDto } from './dto/filterCTNganhDaoTao.dto';
import * as lodash from 'lodash';
@ApiTags('chi-tiet-nganh-dao-tao')
@Controller('chi-tiet-nganh-dao-tao')
export class ChiTietNganhDaoTaoController {
  constructor(private readonly chiTietNganhDaoTao: ChiTietNganhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterCTNganhDaoTaoDto): Promise<any> {
    return await this.chiTietNganhDaoTao.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chiTietNganhDaoTao.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateCTNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.chiTietNganhDaoTao.create({
        ...newData,
        createdBy: user?.ID,
        updatedBy: user?.ID
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.CREATED).json({ message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateCTNganhDaoTaoDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chiTietNganhDaoTao.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chiTietNganhDaoTao.delete(Number(id), user?.ID);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_SUCCESSFULLY });
  }
}
