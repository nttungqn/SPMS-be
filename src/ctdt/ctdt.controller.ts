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
import { NGANHDAOTAO_MESSAGE } from 'constant/constant';
import { CtdtService } from './ctdt.service';
import { CreateNganhDaoTaoDto } from './dto/createNganhDaoTao.dto';
import { FilterNganhDaoTaoDto } from './dto/filterNganhDaoTao.dto';
import * as lodash from 'lodash';
import { NganhDaoTaoDto, NganhDaoTaoResponseDto } from './entity/nganhDaoTao.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('nganh-dao-tao')
@Controller('nganh-dao-tao')
export class CtdtController {
  constructor(private readonly nganhDaoTaoService: CtdtService) {}

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin ngành đào tạo' })
  @ApiOkResponse({ description: 'OK', type: NganhDaoTaoResponseDto })
  @ApiNotFoundResponse({ description: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_EMPTY })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterNganhDaoTaoDto): Promise<any> {
    return await this.nganhDaoTaoService.findAll(filter);
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin chi tiết của 1 ngành đào tạo' })
  @ApiOkResponse({ description: 'OK', type: NganhDaoTaoDto })
  @ApiNotFoundResponse({ description: NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND })
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.nganhDaoTaoService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ description: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'tạo mới ngành đào tạo' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() newData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      const content = await this.nganhDaoTaoService.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
      return {
        response: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_SUCCESSFULLY,
        message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_SUCCESSFULLY,
        status: HttpStatus.CREATED,
        id: content.id,
        content
      };
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.CREATE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 ngành đào tạo' })
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.nganhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: NGANHDAOTAO_MESSAGE.UPDATE_NGANHDAOTAO_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOkResponse({ description: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 ngành đào tạo' })
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.nganhDaoTaoService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: NGANHDAOTAO_MESSAGE.DELETE_NGANHDAOTAO_SUCCESSFULLY });
  }
}
