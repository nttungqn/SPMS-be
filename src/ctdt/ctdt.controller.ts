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
import { NGANHDAOTAO_MESSAGE } from 'constant/constant';
import { CtdtService } from './ctdt.service';
import { CreateNganhDaoTaoDto } from './dto/createNganhDaoTao.dto';
import { FilterNganhDaoTaoDto } from './dto/filterNganhDaoTao.dto';
import * as lodash from 'lodash';

@ApiTags('nganh-dao-tao')
@Controller('nganh-dao-tao')
export class CtdtController {
  constructor(private readonly nganhDaoTaoService: CtdtService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterNganhDaoTaoDto): Promise<any> {
    return await this.nganhDaoTaoService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.nganhDaoTaoService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.nganhDaoTaoService.create({
        ...newData,
        createdBy: user?.ID,
        updatedBy: user?.ID
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.CREATED).json({ message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.nganhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.nganhDaoTaoService.delete(Number(id), user?.ID);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_SUCCESSFULLY });
  }
}
