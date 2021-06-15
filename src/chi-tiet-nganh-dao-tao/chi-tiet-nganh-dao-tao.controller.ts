import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { CTNGANHDAOTAO_MESSAGE } from 'constant/constant';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { CreateCTNganhDaoTaoDto } from './dto/createCTNganhDaoTao.dto';
import { FilterCTNganhDaoTaoDto } from './dto/filterCTNganhDaoTao.dto';
import * as lodash from 'lodash';
import { ChiTietNganhDaoTaoDto, ChiTietNganhDaoTaoResponseDto } from './interfaces/chiTietNganhDaoTao.response';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { FilterIsExistChiTietCTDT } from './dto/filter-exist-CTNganhDaoTao.dto';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
@ApiTags('chi-tiet-nganh-dao-tao')
@Controller('chi-tiet-nganh-dao-tao')
export class ChiTietNganhDaoTaoController {
  constructor(private readonly chiTietNganhDaoTao: ChiTietNganhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/is-exist')
  async isExist(@Query() filter: FilterIsExistChiTietCTDT) {
    const found = await this.chiTietNganhDaoTao.isExist(filter);
    if (found) return { isConflict: true };
    return { isConflict: false };
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin của chi tiết ngành đào tạo' })
  @ApiOkResponse({ description: 'OK', type: ChiTietNganhDaoTaoResponseDto })
  @ApiNotFoundResponse({ description: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_EMPTY })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterCTNganhDaoTaoDto): Promise<any> {
    return await this.chiTietNganhDaoTao.findAll(filter);
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin của chi tiết ngành đào tạo theo id' })
  @ApiOkResponse({ description: 'OK', type: ChiTietNganhDaoTaoDto })
  @ApiNotFoundResponse({ description: CTNGANHDAOTAO_MESSAGE.CTNGANHDAOTAO_ID_NOT_FOUND })
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chiTietNganhDaoTao.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ description: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'tạo mới chi tiết ngành đào tạo' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() newData: CreateCTNganhDaoTaoDto, @Res() res): Promise<any> {
    const { khoa } = newData;
    const regex = new RegExp(/^(19|20)\d{2}$/);
    if (!regex.test(khoa + '')) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED,
        error: 'Khoa value : 19xx -> 20xx'
      });
    }
    const user = req.user || {};
    let result: ChiTietNganhDaoTaoEntity;
    try {
      result = await this.chiTietNganhDaoTao.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.CREATED).json({
      response: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_SUCCESSFULLY,
      message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_SUCCESSFULLY,
      id: result.id
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 chi tiết ngành đào tạo' })
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateCTNganhDaoTaoDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    const { khoa } = updatedData;
    const regex = new RegExp(/^(19|20)\d{2}$/);
    if (!regex.test(khoa.toString())) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: CTNGANHDAOTAO_MESSAGE.CREATE_CTNGANHDAOTAO_FAILED,
        error: 'Khoa value : 19xx -> 20xx'
      });
    }
    try {
      await this.chiTietNganhDaoTao.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CTNGANHDAOTAO_MESSAGE.UPDATE_CTNGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 chi tiết ngành đào tạo' })
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.chiTietNganhDaoTao.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CTNGANHDAOTAO_MESSAGE.DELETE_CTNGANHDAOTAO_SUCCESSFULLY });
  }
}
