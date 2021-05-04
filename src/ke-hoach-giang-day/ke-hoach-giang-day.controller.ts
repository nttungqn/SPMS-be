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
import { CreateKeHoachGiangDayDto } from './dto/createKeHoachGiangDay.dto';
import { FilterKeHoachGiangDayDto } from './dto/filterKeHoachGiangDay.dto';
import { KeHoachGiangDayService } from './ke-hoach-giang-day.service';
import * as lodash from 'lodash';
import { KEHOACHGIANGDAY_MESSAGE } from 'constant/constant';
import { KeHoachGiangDayDto, KeHoachGiangDayResponseDto } from './interfaces/keHoachGiangDay.response';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('ke-hoach-giang-day')
@Controller('ke-hoach-giang-day')
export class KeHoachGiangDayController {
  constructor(private readonly keHoachGiangDayService: KeHoachGiangDayService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin kế hoạch giảng dạy' })
  @ApiOkResponse({ description: 'OK', type: KeHoachGiangDayResponseDto })
  @ApiNotFoundResponse({ description: KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_EMPTY })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterKeHoachGiangDayDto): Promise<any> {
    return await this.keHoachGiangDayService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'lấy thông tin chi tiết của 1 kế hoạch giảng dạy' })
  @ApiOkResponse({ description: 'OK', type: KeHoachGiangDayDto })
  @ApiNotFoundResponse({ description: KEHOACHGIANGDAY_MESSAGE.KEHOACHGIANGDAY_ID_NOT_FOUND })
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.keHoachGiangDayService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiCreatedResponse({ description: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_FAILED })
  @ApiOperation({ summary: 'tạo mới kế hoạch giảng dạy' })
  @Post()
  async create(@Req() req, @Body() newData: CreateKeHoachGiangDayDto, @Res() res): Promise<any> {
    const user = req.user || {};
    try {
      await this.keHoachGiangDayService.create({
        ...newData,
        createdBy: user?.id,
        updatedBy: user?.id
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res
      .status(HttpStatus.CREATED)
      .json({ message: KEHOACHGIANGDAY_MESSAGE.CREATE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @Put(':id')
  @ApiOkResponse({ description: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_FAILED })
  @ApiOperation({ summary: 'cập nhật thông tin của 1 kế hoạch giảng dạy' })
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateKeHoachGiangDayDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.keHoachGiangDayService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: KEHOACHGIANGDAY_MESSAGE.UPDATE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @Delete(':id')
  @ApiOkResponse({ description: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_FAILED })
  @ApiOperation({ summary: 'xóa thông tin của 1 kế hoạch giảng dạy' })
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    try {
      await this.keHoachGiangDayService.delete(Number(id), user?.id);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_FAILED,
        error: lodash.get(error, 'response', 'error')
      });
    }
    return res.status(HttpStatus.OK).json({ message: KEHOACHGIANGDAY_MESSAGE.DELETE_KEHOACHGIANGDAY_SUCCESSFULLY });
  }
}
