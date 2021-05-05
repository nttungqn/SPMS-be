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
import { HoatDongDayHocService } from './hoat-dong-day-hoc.service';
import { CreateHoatDongDayHocDTO } from './dto/create-hoat-dong-day-hoc';
import { FilterHoatDongDayHoc } from './dto/filter-hoat-đong-day-hoc';
import { HOATDONGDAYHOC_MESSAGE } from 'constant/constant';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('hoat-dong-day-hoc')
@Controller('hoat-dong-day-hoc')
export class HoatDongDayHocController {
  constructor(private readonly hoatDongDayHocService: HoatDongDayHocService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách hoat dong day hoc' })
  @ApiUnauthorizedResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FilterHoatDongDayHoc })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterHoatDongDayHoc): Promise<any> {
    return await this.hoatDongDayHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết hoạt động dạy học' })
  @ApiNotFoundResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: HoatDongDayHocEntity })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<any> {
    return await this.hoatDongDayHocService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo hoạt động dạy học' })
  @ApiUnauthorizedResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDAYHOC_MESSAGE.CREATE_HOATDONGDAYHOC_FAILED })
  @ApiOkResponse({ description: HOATDONGDAYHOC_MESSAGE.CREATE_HOATDONGDAYHOC_SUCCESSFULLY })
  @Post()
  async create(@Req() req, @Body() newData: CreateHoatDongDayHocDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.hoatDongDayHocService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật hoạt động dạy học' })
  @ApiNotFoundResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDAYHOC_MESSAGE.UPDATE_HOATDONGDAYHOC_FAILED })
  @ApiOkResponse({ description: HOATDONGDAYHOC_MESSAGE.UPDATE_HOATDONGDAYHOC_SUCCESSFULLY })
  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() updatedData: CreateHoatDongDayHocDTO): Promise<any> {
    const user = req.user || {};
    await this.hoatDongDayHocService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return new HttpException(HOATDONGDAYHOC_MESSAGE.UPDATE_HOATDONGDAYHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa hoạt động dạy học' })
  @ApiNotFoundResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: HOATDONGDAYHOC_MESSAGE.HOATDONGDAYHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_FAILED })
  @ApiOkResponse({ description: HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number): Promise<any> {
    const user = req.user || {};
    await this.hoatDongDayHocService.delete(Number(id), user?.id);
    return new HttpException(HOATDONGDAYHOC_MESSAGE.DELETE_HOATDONGDAYHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
