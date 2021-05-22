import { ChuDeEntity } from 'chu-de/entity/chu-de.entity';
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
import { ChuanDauRaNganhDaoTaoService } from './chuan-dau-ra-nganh-dao-tao.service';
import { CreateChuanDauRaNganhDaoTaoDto } from './dto/createChuanDauRaNDT.dto';
import { FilterChuanDauRaNganhDaoTaoDto } from './dto/filterChuanDauRaNDT.dto';
import * as lodash from 'lodash';
import { CHUANDAURA_NGANHDAOTAO_MESSAGE } from 'constant/constant';
import { ChuanDauRaNDTDto, ChuanDauRaNDTResponseDto } from './interfaces/chuanDauRaNDT.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('chuan-dau-ra-nganh-dao-tao')
@Controller('chuan-dau-ra-nganh-dao-tao')
export class ChuanDauRaNganhDaoTaoController {
  constructor(private readonly chuanDauRaNganhDaoTaoService: ChuanDauRaNganhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin chuẩn đầu ra ngành đào tạo' })
  @ApiOkResponse({ description: 'OK', type: ChuanDauRaNDTResponseDto })
  @ApiNotFoundResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChuanDauRaNganhDaoTaoDto): Promise<any> {
    return await this.chuanDauRaNganhDaoTaoService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get(':id')
  @ApiOperation({ summary: 'lấy thông tin chi tiết của 1 chuẩn đầu ra ngành đào tạo' })
  @ApiOkResponse({ description: 'OK', type: ChuanDauRaNDTDto })
  @ApiNotFoundResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND })
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chuanDauRaNganhDaoTaoService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post()
  @ApiCreatedResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.CREATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.CREATE_CHUANDAURA_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'tạo mới chuẩn đầu ra ngành đào tạo' })
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Put(':id')
  @ApiOkResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.UPDATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.UPDATE_CHUANDAURA_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 chuẩn đầu ra ngành đào tạo' })
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Delete(':id')
  @ApiOkResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.DELETE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.DELETE_CHUANDAURA_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 chương trình đào tạo ngành đào tạo' })
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin chuẩn đầu ra ngành đào tạo' })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: CHUANDAURA_NGANHDAOTAO_MESSAGE.CHUANDAURA_NGANHDAOTAO_EMPTY })
  @Get('/chuan-dau-ra-list/:id')
  async getAllList(@Req() req, @Param('id') idCTNDT: number): Promise<any> {
    return await this.chuanDauRaNganhDaoTaoService.getAllList(idCTNDT);
  }
}
