import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpException,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';
import { CreateMucTieuMonHocDto } from './dto/create-muc-tieu-mon-hoc.dto';
import { UpdateMucTieuMonHocDto } from './dto/update-muc-tieu-mon-hoc.dto';
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
import { AuthGuard } from '@nestjs/passport';
import { FilterMucTieuMonHoc } from './dto/filter-muc-tieu-mon-hoc.dto';
import { MUCTIEUMONHOC_MESSAGE } from 'constant/constant';
import { FindAllMucTieuMonHocResponse } from './Responses/find-all-muc-tieu-mon-hoc.response';
import { MucTieuMonHocResponse } from './Responses/muc-tieu-mon-hoc.response';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';

@ApiTags('muc-tieu-mon-hoc')
@Controller('muc-tieu-mon-hoc')
export class MucTieuMonHocController {
  constructor(private readonly mucTieuMonHocService: MucTieuMonHocService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các  Mục tiêu môn học' })
  @ApiUnauthorizedResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllMucTieuMonHocResponse })
  @Get()
  findAll(@Query() filter: FilterMucTieuMonHoc) {
    return this.mucTieuMonHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một Mục tiêu môn học' })
  @ApiUnauthorizedResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: MucTieuMonHocResponse })
  @ApiNotFoundResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mucTieuMonHocService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới Mục tiêu môn học' })
  @ApiUnauthorizedResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_NOT_AUTHORIZED })
  @ApiCreatedResponse({ description: MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_FAILED })
  @ApiConflictResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST })
  @Post()
  async create(@Body() createMucTieuMonHocDto: CreateMucTieuMonHocDto, @GetUser() user: UsersEntity) {
    await this.mucTieuMonHocService.create(createMucTieuMonHocDto, user);
    return new HttpException(MUCTIEUMONHOC_MESSAGE.CREATE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin Mục tiêu môn học' })
  @ApiUnauthorizedResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_FAILED })
  @ApiConflictResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_EXIST })
  @ApiNotFoundResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND })
  @ApiOkResponse({ description: MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMucTieuMonHocDto: UpdateMucTieuMonHocDto,
    user: UsersEntity
  ) {
    await this.mucTieuMonHocService.update(id, updateMucTieuMonHocDto, user);
    return new HttpException(MUCTIEUMONHOC_MESSAGE.UPDATE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một Mục tiêu môn học' })
  @ApiUnauthorizedResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_FAILED })
  @ApiNotFoundResponse({ description: MUCTIEUMONHOC_MESSAGE.MUCTIEUMONHOC_ID_NOT_FOUND })
  @ApiOkResponse({ description: MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, user: UsersEntity) {
    await this.mucTieuMonHocService.remove(id, user);
    return new HttpException(MUCTIEUMONHOC_MESSAGE.DELETE_MUCTIEUMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
