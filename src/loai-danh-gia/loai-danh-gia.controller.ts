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
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  ValidationPipe,
  HttpCode
} from '@nestjs/common';
import { LoaiDanhGiaService } from './loai-danh-gia.service';
import { CreateLoaiDanhGiaDto } from './dto/create-loai-danh-gia.dto';
import { UpdateLoaiDanhGiaDto } from './dto/update-loai-danh-gia.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { FilterLoaiDanhGia } from './dto/filter-loai-danh-gia.dto';
import { AuthGuard } from '@nestjs/passport';
import { LOAIDANHGIA_MESSAGE } from 'constant/constant';
import { FindAllLoaiDanhGiaResponse } from './responses/find-all-loai-danh-gia.response';
import { LoaiDanhGiaResponse } from './responses/loai-danh-gia.response';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('loai-danh-gia')
@Controller('loai-danh-gia')
export class LoaiDanhGiaController {
  constructor(private readonly loaiDanhGiaService: LoaiDanhGiaService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới một Loai đánh giá' })
  @ApiCreatedResponse({ description: LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_FAILED })
  @ApiConflictResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST })
  @ApiUnauthorizedResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_NOT_AUTHORIZED })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createLoaiDanhGiaDto: CreateLoaiDanhGiaDto, @GetUser() user: UsersEntity) {
    const result = await this.loaiDanhGiaService.create(createLoaiDanhGiaDto, user);
    return {
      response: LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_SUCCESSFULLY,
      message: LOAIDANHGIA_MESSAGE.CREATE_LOAIDANHGIA_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các Loại đánh giá' })
  @ApiUnauthorizedResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllLoaiDanhGiaResponse })
  @Get()
  findAll(@Query() filter: FilterLoaiDanhGia) {
    return this.loaiDanhGiaService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một Loại đánh giá' })
  @ApiUnauthorizedResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND })
  @ApiOkResponse({ type: LoaiDanhGiaResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loaiDanhGiaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin một Loại đánh giá' })
  @ApiUnauthorizedResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND })
  @ApiOkResponse({ description: LOAIDANHGIA_MESSAGE.UPDATE_LOAIDANHGIA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: LOAIDANHGIA_MESSAGE.UPDATE_LOAIDANHGIA_FAILED })
  @ApiConflictResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_EXIST })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateLoaiDanhGiaDto: UpdateLoaiDanhGiaDto,
    @GetUser() user: UsersEntity
  ) {
    await this.loaiDanhGiaService.update(id, updateLoaiDanhGiaDto, user);
    return new HttpException(LOAIDANHGIA_MESSAGE.UPDATE_LOAIDANHGIA_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một Loại đánh giá' })
  @ApiUnauthorizedResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: LOAIDANHGIA_MESSAGE.LOAIDANHGIA_ID_NOT_FOUND })
  @ApiOkResponse({ description: LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_FAILED })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: UsersEntity) {
    await this.loaiDanhGiaService.remove(id, user);
    return new HttpException(LOAIDANHGIA_MESSAGE.DELETE_LOAIDANHGIA_SUCCESSFULLY, HttpStatus.OK);
  }
}
