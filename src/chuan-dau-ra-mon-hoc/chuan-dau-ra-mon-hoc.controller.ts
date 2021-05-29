import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  HttpCode
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
import { GetUser } from 'auth/user.decorator';
import { CHUANDAURAMONHOC_MESSAGE } from 'constant/constant';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { UsersEntity } from 'users/entity/user.entity';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';
import { ChuanDauRaMonHocResponse } from './responses/chuan-dau-ra-mon-hoc.response';
import { FilterChuanDauRaMonHocResponse } from './responses/filter-chuan-dau-ra-mon-hoc.response';

@ApiTags('chuan-dau-ra-mon-hoc')
@Controller('chuan-dau-ra-mon-hoc')
export class ChuanDauRaMonHocController {
  constructor(private readonly chuanDauRaMonHocService: ChuanDauRaMonHocService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin các chuẩn đầu ra môn học' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FilterChuanDauRaMonHocResponse })
  @Get()
  findAll(@Query() fillter: FilterChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.findAll(fillter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới chuẩn đầu ra môn học' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_FAILED })
  @ApiOkResponse({ description: CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND })
  @ApiConflictResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_EXIST })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createChuanDauRaMonHocDto: CreateChuanDauRaMonHocDto, @GetUser() user: UsersEntity) {
    const result = await this.chuanDauRaMonHocService.create(createChuanDauRaMonHocDto, user);
    return {
      response: CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_SUCCESSFULLY,
      message: CHUANDAURAMONHOC_MESSAGE.CREATE_CHUANDAURAMONHOC_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin chuẩn đầu ra môn học' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND })
  @ApiOkResponse({ type: ChuanDauRaMonHocResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chuanDauRaMonHocService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin chuẩn đầu ra môn học' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUANDAURAMONHOC_MESSAGE.UPDATE_CHUANDAURAMONHOC_FAILED })
  @ApiOkResponse({ description: CHUANDAURAMONHOC_MESSAGE.UPDATE_CHUANDAURAMONHOC_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND })
  @ApiConflictResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_EXIST })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChuanDauRaMonHocDto: UpdateChuanDauRaMonHocDto,
    @GetUser() user: UsersEntity
  ) {
    await this.chuanDauRaMonHocService.update(id, updateChuanDauRaMonHocDto, user);
    return new HttpException(CHUANDAURAMONHOC_MESSAGE.UPDATE_CHUANDAURAMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một chuẩn đầu ra môn hoc' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_FAILED })
  @ApiOkResponse({ description: CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: UsersEntity) {
    await this.chuanDauRaMonHocService.remove(id, user);
    return new HttpException(CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
