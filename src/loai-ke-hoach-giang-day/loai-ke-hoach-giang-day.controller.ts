import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LoaiKeHoachGiangDayService } from './loai-ke-hoach-giang-day.service';
import { CreateLoaiKeHoachGiangDayDto } from './dto/createLoaiKeHoachGiangDay.dto';
import { BaseFilterDto } from './dto/fliterLoaiKeHoachGiangDay.dto';
import { LOAIKEHOACHGIANGDAY_MESSAGE } from './../constant/constant';
import { FindAllLoaiKeHoachGiangDayDtoResponse } from './dto/loai-ke-hoach-giang-day.response';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';

@ApiTags('loai-ke-hoach-giang-day')
@Controller('loai-ke-hoach-giang-day')
export class LoaiKeHoachGiangDayController {
  constructor(private readonly loaiKeHoachGiangDayService: LoaiKeHoachGiangDayService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách loại kế hoạch giảng dạy' })
  @ApiUnauthorizedResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllLoaiKeHoachGiangDayDtoResponse })
  @Get()
  async findAll(@Req() req, @Query() filter: BaseFilterDto): Promise<any> {
    return await this.loaiKeHoachGiangDayService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin loại kế hoạch giảng dạy' })
  @ApiNotFoundResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED })
  @ApiOkResponse({ type: LoaiKeHoachGiangDayEntity })
  @Get(':id')
  async findById(@Req() req, @Param() id: number): Promise<any> {
    return await this.loaiKeHoachGiangDayService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo loại kế hoạch giảng dạy' })
  @ApiUnauthorizedResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.CREATE_LOAIKEHOACHGIANGDAY_FAILED })
  @ApiOkResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.CREATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY })
  @Post()
  async create(@Req() req, @Body() newData: CreateLoaiKeHoachGiangDayDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.loaiKeHoachGiangDayService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật loại kế hoạch giảng dạy' })
  @ApiNotFoundResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_FAILED })
  @ApiOkResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Req() req,
    @Param() id: number,
    @Body() updatedData: CreateLoaiKeHoachGiangDayDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    await this.loaiKeHoachGiangDayService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return new HttpException(LOAIKEHOACHGIANGDAY_MESSAGE.UPDATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa loại kế hoạch giảng dạy' })
  @ApiNotFoundResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_FAILED })
  @ApiOkResponse({ description: LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param() id: number, @Res() res): Promise<any> {
    const user = req.user || {};
    await this.loaiKeHoachGiangDayService.delete(Number(id), user?.id);
    return new HttpException(LOAIKEHOACHGIANGDAY_MESSAGE.DELETE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY, HttpStatus.OK);
  }
}
