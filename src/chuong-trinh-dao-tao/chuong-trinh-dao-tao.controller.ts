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
import { CHUONGTRINHDAOTAO_MESSAGE } from 'constant/constant';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { CreateChuongTrinhDaoTaoDto, CreateDetailChuongTrinhDaoTaoDto } from './dto/createChuongTrinhDaoTao.dto';
import { FilterChuongTrinhDaoTao } from './dto/filterChuongTrinhDaoTao.dto';
import { IdDto } from './dto/Id.dto';
import * as lodash from 'lodash';
import { ChuongTrinhDaoTaoDto, ChuongTrinhDaoTaoResponseDto } from './interfaces/chuongTrinhTaoDao.response';
import { RolesGuard } from 'guards/roles.guard';
import { FilterIsExistCTDT } from './dto/filter-is-exist-chuong-trinh-dao-tao.dto';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';

@ApiTags('chuong-trinh-dao-tao')
@Controller('chuong-trinh-dao-tao')
export class ChuongTrinhDaoTaoController {
  constructor(private readonly chuongTrinhDaoTaoService: ChuongTrinhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/is-exits')
  async isExist(@Query() filter: FilterIsExistCTDT) {
    const found = await this.chuongTrinhDaoTaoService.isExist(filter);
    if (found) {
      return { isConflict: true, content: found };
    }
    return { isConflict: false };
  }

  @Get()
  @ApiOperation({ summary: 'lấy thông tin chương trình đào tạo' })
  @ApiOkResponse({ description: 'OK', type: ChuongTrinhDaoTaoResponseDto })
  @ApiNotFoundResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_EMPTY })
  async getAll(@Req() req, @Query() filter: FilterChuongTrinhDaoTao) {
    return await this.chuongTrinhDaoTaoService.findAll(filter);
  }
  @Get(':id')
  @ApiOperation({ summary: 'lấy thông tin chi tiết của 1 chương trình đào tạo' })
  @ApiOkResponse({ description: 'OK', type: ChuongTrinhDaoTaoDto })
  @ApiNotFoundResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.CHUONGTRINHDAOTAO_ID_NOT_FOUND })
  async getById(@Req() req, @Param() param: IdDto) {
    const { id } = param;
    return await this.chuongTrinhDaoTaoService.findById(Number(id));
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED })
  @ApiOperation({ summary: 'tạo mới chương trình đào tạo' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Res() res, @Body() newData: CreateChuongTrinhDaoTaoDto) {
    const user = req.user || {};
    let result: ChuongTrinhDaoTaoEntity;
    try {
      result = await this.chuongTrinhDaoTaoService.create({ ...newData, createdBy: user?.id, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.CREATED).json({
      response: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY,
      message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    });
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 chương trình đào tạo' })
  @Put(':id')
  async update(@Req() req, @Res() res, @Param() param: IdDto, @Body() updatedData: CreateChuongTrinhDaoTaoDto) {
    const { id } = param;
    const user = req.user || {};
    try {
      await this.chuongTrinhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUONGTRINHDAOTAO_MESSAGE.UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY });
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 chương trình đào tạo' })
  @Delete(':id')
  async delete(@Req() req, @Res() res, @Param() param: IdDto) {
    const { id } = param;
    const user = req.user || {};
    try {
      await this.chuongTrinhDaoTaoService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: CHUONGTRINHDAOTAO_MESSAGE.DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post('create-detail')
  async createDetail(@Req() req, @Res() res, @Body() body: CreateDetailChuongTrinhDaoTaoDto) {
    // const found = await this.chuongTrinhDaoTaoService.isExist({ten: body?.ten, maCTDT: body?.maCTDT});
    // if (found) {
    //   return res.status(HttpStatus.OK).json({ isConflict: true, content: found });
    // }
    
    const user = req.user || {};
    try {
      const results = await this.chuongTrinhDaoTaoService.createDetail(body, user);
      return res.json({data: results});
    } catch (error) {
      return res.status(HttpStatus.OK).json({
        message: CHUONGTRINHDAOTAO_MESSAGE.CREATE_CHUONGTRINHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
  }
}
