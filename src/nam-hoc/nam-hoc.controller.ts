import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { NamHocService } from './nam-hoc.service';
import { CreateNamHocDto } from './dto/create-nam-hoc.dto';
import { UpdateNamHocDto } from './dto/update-nam-hoc.dto';
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
import { NAMHOC_MESSAGE } from 'constant/constant';
import { FindAllNamHocResponse } from './Responses/find-all-nam-hoc.response';
import { NamHocResponse } from './Responses/nam-hoc.respones';
import { RolesGuard } from 'guards/roles.guard';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';

@ApiTags('nam-hoc')
@Controller('nam-hoc')
export class NamHocController {
  constructor(private readonly schoolYearService: NamHocService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới một năm học' })
  @ApiCreatedResponse({ description: NAMHOC_MESSAGE.CREATE_NAMHOC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: NAMHOC_MESSAGE.CREATE_NAMHOC_FAILED })
  @ApiConflictResponse({ description: NAMHOC_MESSAGE.NAMHOC_EXIST })
  @ApiUnauthorizedResponse({ description: NAMHOC_MESSAGE.NAMHOC_NOT_AUTHORIZED })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createSchoolYearDto: CreateNamHocDto) {
    await this.schoolYearService.create(createSchoolYearDto);
    return new HttpException(NAMHOC_MESSAGE.CREATE_NAMHOC_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các năm học' })
  @ApiUnauthorizedResponse({ description: NAMHOC_MESSAGE.NAMHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllNamHocResponse })
  @Get()
  findAll() {
    return this.schoolYearService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một năm học' })
  @ApiUnauthorizedResponse({ description: NAMHOC_MESSAGE.NAMHOC_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: NAMHOC_MESSAGE.NAMHOC_ID_NOT_FOUND })
  @ApiOkResponse({ type: NamHocResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schoolYearService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin một năm học' })
  @ApiUnauthorizedResponse({ description: NAMHOC_MESSAGE.NAMHOC_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: NAMHOC_MESSAGE.NAMHOC_ID_NOT_FOUND })
  @ApiInternalServerErrorResponse({ description: NAMHOC_MESSAGE.UPDATE_NAMHOC_FAILED })
  @ApiConflictResponse({ description: NAMHOC_MESSAGE.NAMHOC_EXIST })
  @ApiOkResponse({ description: NAMHOC_MESSAGE.UPDATE_NAMHOC_SUCCESSFULLY })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSchoolYearDto: UpdateNamHocDto) {
    await this.schoolYearService.update(id, updateSchoolYearDto);
    return new HttpException(NAMHOC_MESSAGE.UPDATE_NAMHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một năm học' })
  @ApiUnauthorizedResponse({ description: NAMHOC_MESSAGE.NAMHOC_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: NAMHOC_MESSAGE.NAMHOC_ID_NOT_FOUND })
  @ApiInternalServerErrorResponse({ description: NAMHOC_MESSAGE.DELETE_NAMHOC_FAILED })
  @ApiOkResponse({ description: NAMHOC_MESSAGE.DELETE_NAMHOC_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.schoolYearService.remove(id);
    return new HttpException(NAMHOC_MESSAGE.DELETE_NAMHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
