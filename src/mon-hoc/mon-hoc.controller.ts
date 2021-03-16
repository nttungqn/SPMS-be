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
import { MonHocService } from './mon-hoc.service';
import { CreateMonHocDto } from './dto/create-mon-hoc.dto';
import { UpdateMonHocDto } from './dto/update-mon-hoc.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterMonHoc } from './dto/filter-mon-hoc.dto';
import { MONHOC_MESSAGE } from 'constant/constant';
import { FindAllMonHocDtoResponse } from './dto/mon-hoc.response.dto';
import { MonHocEntity } from './entity/mon-hoc.entity';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

@ApiTags('mon-hoc')
@Controller('mon-hoc')
export class MonHocController {
  constructor(private readonly monHocService: MonHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllMonHocDtoResponse })
  @Get()
  async findAll(@Query() filter: BaseFilterDto): Promise<any> {
    return await this.monHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: MonHocEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monHocService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiConflictResponse({ description: MONHOC_MESSAGE.MONHOC_FOREIGN_KEY_CONFLICT })
  @ApiInternalServerErrorResponse({ description: MONHOC_MESSAGE.CREATE_MONHOC_FAILED })
  @ApiOkResponse({ type: CreateMonHocDto })
  @Post()
  async create(@Body() CreateMonHocDto: CreateMonHocDto, @Req() req) {
    const user = req.user || {};
    return await this.monHocService.create({
      ...CreateMonHocDto,
      updatedBy: user?.id,
      createdBy: user?.id
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MONHOC_MESSAGE.UPDATE_MONHOC_FAILED })
  @ApiOkResponse({ description: MONHOC_MESSAGE.UPDATE_MONHOC_SUCCESSFULLY })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() UpdateMonHocDto: UpdateMonHocDto, @Req() req) {
    const user = req.user || {};
    await this.monHocService.update(id, {
      ...UpdateMonHocDto,
      updatedAt: new Date(),
      updatedBy: user?.id
    });
    return new HttpException(MONHOC_MESSAGE.UPDATE_MONHOC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: MONHOC_MESSAGE.DELETE_MONHOC_FAILED })
  @ApiOkResponse({ description: MONHOC_MESSAGE.DELETE_MONHOC_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.monHocService.delete(id, user?.id);
    return new HttpException(MONHOC_MESSAGE.DELETE_MONHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
