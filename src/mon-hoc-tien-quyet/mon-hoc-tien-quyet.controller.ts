import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ValidationPipe,
  Query,
  BadRequestException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { MonHocTienQuyetService } from './mon-hoc-tien-quyet.service';
import { CreateMonHocTienQuyetDto } from './dto/create-mon-hoc-tien-quyet.dto';
import { UpdateMonHocKienQuyetDto } from './dto/update-mon-hoc-tien-quyet.dto';
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
import { FilterMonHocKienQuyet } from './dto/filter-mon-hoc-tien-quyet.dto';
import { MONHOCTIENQUYET_MESSAGE } from 'constant/constant';
import { FindAllMonHocTienQuyetResponse } from './Responses/find-all-mon-hoc-tien-quyet.response';
import { MonHocTienQuyetResponse } from './Responses/mon-hoc-tien-quyet.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('mon-hoc-tien-quyet')
@Controller('mon-hoc-tien-quyet')
export class MonHocTienQuyetController {
  constructor(private readonly prerequisiteSubjectService: MonHocTienQuyetService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới Môn học tiên quyết' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiCreatedResponse({ description: MONHOCTIENQUYET_MESSAGE.CREATE_MONHOCTIENQUYET_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: MONHOCTIENQUYET_MESSAGE.CREATE_MONHOCTIENQUYET_FAILED })
  @ApiConflictResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_EXIST })
  @Post()
  async create(@Body(ValidationPipe) createPrerequisiteSubjectDto: CreateMonHocTienQuyetDto, @Req() req) {
    const user = req.user || {};
    const { monHoc, monHocTruoc } = createPrerequisiteSubjectDto;
    if (monHoc === monHocTruoc) return new BadRequestException();
    await this.prerequisiteSubjectService.create({
      ...createPrerequisiteSubjectDto,
      updatedBy: user?.id,
      createdBy: user?.id
    });
    return new HttpException(MONHOCTIENQUYET_MESSAGE.CREATE_MONHOCTIENQUYET_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các  Môn học tiên quyết' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllMonHocTienQuyetResponse })
  @Get()
  findAll(@Query(ValidationPipe) filter: FilterMonHocKienQuyet) {
    return this.prerequisiteSubjectService.findAllPrereSuject(null, filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các môn học tiên quyết của một môn học' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllMonHocTienQuyetResponse })
  @Get('mon-hoc/:idMonHoc')
  findAllPrereSubject(
    @Param('idMonHoc', ParseIntPipe) id: number,
    @Query(ValidationPipe) filter: FilterMonHocKienQuyet
  ) {
    return this.prerequisiteSubjectService.findAllPrereSuject(id, filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một Môn học tiên quyết' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiOkResponse({ type: MonHocTienQuyetResponse })
  @ApiNotFoundResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_ID_NOT_FOUND })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prerequisiteSubjectService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật một Môn học tiên quyết' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MONHOCTIENQUYET_MESSAGE.UPDATE_MONHOCTIENQUYET_FAILED })
  @ApiConflictResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_EXIST })
  @ApiOkResponse({ description: MONHOCTIENQUYET_MESSAGE.UPDATE_MONHOCTIENQUYET_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_ID_NOT_FOUND })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePrerequisiteSubjectDto: UpdateMonHocKienQuyetDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.prerequisiteSubjectService.update(id, {
      ...updatePrerequisiteSubjectDto,
      updatedBy: user?.id,
      updatedAt: new Date()
    });
    return new HttpException(MONHOCTIENQUYET_MESSAGE.UPDATE_MONHOCTIENQUYET_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một Môn học tiên quyết' })
  @ApiUnauthorizedResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MONHOCTIENQUYET_MESSAGE.DELETE_MONHOCTIENQUYET_FAILED })
  @ApiOkResponse({ description: MONHOCTIENQUYET_MESSAGE.DELETE_MONHOCTIENQUYET_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: MONHOCTIENQUYET_MESSAGE.MONHOCTIENQUYET_ID_NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.prerequisiteSubjectService.remove(id, user?.id);
    return new HttpException(MONHOCTIENQUYET_MESSAGE.DELETE_MONHOCTIENQUYET_SUCCESSFULLY, HttpStatus.OK);
  }
}
