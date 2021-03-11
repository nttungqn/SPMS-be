import { Delete, HttpStatus } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { CHUANDAURA_MESSAGE } from 'constant/constant';
import { ChuanDauRaService } from './chuan-dau-ra.service';
import { CreateChuanDauRaDto } from './dto/createChuanDauRa.dto';
import { FilterChuanDauRaDto } from './dto/filterChuanDauRa.dto';
import * as lodash from 'lodash';
import { ChuanDauRaResponseDto, ChuanDauTaDto } from './interfaces/chuanDauRa.response';

@ApiTags('chuan-dau-ra')
@Controller('chuan-dau-ra')
export class ChuanDauRaController {
  constructor(private readonly chuanDauRaService: ChuanDauRaService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  @ApiOperation({ summary: 'lấy thông tin chuẩn đầu ra' })
  @ApiOkResponse({ description: 'OK', type: ChuanDauRaResponseDto })
  @ApiNotFoundResponse({ description: CHUANDAURA_MESSAGE.CHUANDAURA_EMPTY })
  async findAll(@Req() req, @Query() filter: FilterChuanDauRaDto): Promise<any> {
    return await this.chuanDauRaService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  @ApiOperation({ summary: 'lấy thông tin chi tiết của 1 chuẩn đầu ra' })
  @ApiOkResponse({ description: 'OK', type: ChuanDauTaDto })
  @ApiNotFoundResponse({ description: CHUANDAURA_MESSAGE.CHUANDAURA_ID_NOT_FOUND })
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chuanDauRaService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  @ApiCreatedResponse({ description: CHUANDAURA_MESSAGE.CREATE_CHUANDAURA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_MESSAGE.CREATE_CHUANDAURA_FAILED })
  @ApiOperation({ summary: 'tạo mới chuẩn đầu ra' })
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
  @ApiOkResponse({ description: CHUANDAURA_MESSAGE.UPDATE_CHUANDAURA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_MESSAGE.UPDATE_CHUANDAURA_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 chuẩn đầu ra' })
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
  @ApiOkResponse({ description: CHUANDAURA_MESSAGE.DELETE_CHUANDAURA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_MESSAGE.DELETE_CHUANDAURA_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 chương trình đào tạo' })
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
