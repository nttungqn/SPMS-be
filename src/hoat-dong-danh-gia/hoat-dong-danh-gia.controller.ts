import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  HttpCode
} from '@nestjs/common';
import { HoatDongDanhGiaService } from './hoat-dong-danh-gia.service';
import { CreateHoatDongDanhGiaDto } from './dto/create-hoat-dong-danh-gia.dto';
import { UpdateHoatDongDanhGiaDto } from './dto/update-hoat-dong-danh-gia.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { FilterHoatDongDanhGia } from './dto/filter-hoat-dong-danh-gia.dto';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { HOATDONGDANHGIA_MESSAGE } from 'constant/constant';
import { AuthGuard } from '@nestjs/passport';
import { HoatDongDanhGiaResponse } from './response/hoat-dong-danh-gia.response';
import { FilterHoatDongDanhGiaResponse } from './response/filter-hoat-dong-danh-gia.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('hoat-dong-danh-gia')
@Controller('hoat-dong-danh-gia')
export class HoatDongDanhGiaController {
  constructor(private readonly hoatDongDanhGiaService: HoatDongDanhGiaService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới hoạt động đánh giá' })
  @ApiUnauthorizedResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_FAILED })
  @ApiOkResponse({ description: HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_SUCCESSFULLY })
  @ApiConflictResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHoatDongDanhGiaDto: CreateHoatDongDanhGiaDto, @GetUser() user: UsersEntity) {
    const result = await this.hoatDongDanhGiaService.create(createHoatDongDanhGiaDto, user);
    return {
      response: HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_SUCCESSFULLY,
      message: HOATDONGDANHGIA_MESSAGE.CREATE_HOATDONGDANHGIA_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các hoạt động đánh giá' })
  @ApiUnauthorizedResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FilterHoatDongDanhGiaResponse })
  @Get()
  findAll(@Query() filter: FilterHoatDongDanhGia) {
    return this.hoatDongDanhGiaService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy một hoạt động đánh giá' })
  @ApiUnauthorizedResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_ID_INVALID })
  @ApiOkResponse({ type: HoatDongDanhGiaResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hoatDongDanhGiaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin hoạt động đánh giá' })
  @ApiUnauthorizedResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDANHGIA_MESSAGE.UPDATE_HOATDONGDANHGIA_FAILED })
  @ApiOkResponse({ description: HOATDONGDANHGIA_MESSAGE.UPDATE_HOATDONGDANHGIA_SUCCESSFULLY })
  @ApiConflictResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_EXIST })
  @ApiNotFoundResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_ID_NOT_FOUND })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHoatDongDanhGiaDto: UpdateHoatDongDanhGiaDto,
    @GetUser() user: UsersEntity
  ) {
    await this.hoatDongDanhGiaService.update(id, updateHoatDongDanhGiaDto, user);
    return new HttpException(HOATDONGDANHGIA_MESSAGE.UPDATE_HOATDONGDANHGIA_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một hoạt động đánh giá' })
  @ApiUnauthorizedResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: HOATDONGDANHGIA_MESSAGE.DELETE_HOATDONGDANHGIA_FAILED })
  @ApiOkResponse({ description: HOATDONGDANHGIA_MESSAGE.DELETE_HOATDONGDANHGIA_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: HOATDONGDANHGIA_MESSAGE.HOATDONGDANHGIA_ID_NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: UsersEntity) {
    await this.hoatDongDanhGiaService.remove(id, user);
    return new HttpException(HOATDONGDANHGIA_MESSAGE.DELETE_HOATDONGDANHGIA_SUCCESSFULLY, HttpStatus.OK);
  }
}
