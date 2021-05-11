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
  ParseIntPipe,
  Res,
  UploadedFile,
  UseInterceptors,
  Type,
  BadRequestException,
  HttpCode
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
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { FilterMonHoc } from './dto/filter-mon-hoc.dto';
import { MONHOC_MESSAGE } from 'constant/constant';
import { FindAllMonHocDtoResponse } from './dto/mon-hoc.response.dto';
import { MonHocEntity } from './entity/mon-hoc.entity';
import * as nodexlsv from 'node-xlsx';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';

@ApiTags('mon-hoc')
@Controller('mon-hoc')
export class MonHocController {
  constructor(private readonly monHocService: MonHocService) {}
  private headersFormat = [
    'MÃ HP',
    'TÊN HP',
    'SỐ TC',
    'LT',
    'TH',
    'BT',
    'LOẠI HP',
    'KHỐI KIẾN THỨC',
    'LOẠI KIẾN THỨC',
    'NGÀNH/CHUYÊN NGÀNH'
  ];

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllMonHocDtoResponse })
  @Get()
  async findAll(@Query() filter: FilterMonHoc): Promise<any> {
    return await this.monHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin môn học' })
  @ApiUnauthorizedResponse({ description: MONHOC_MESSAGE.MONHOC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: MonHocEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monHocService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
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
  @Post('import-data')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'import data từ file xlsx' })
  @UseInterceptors(FileInterceptor('file', {}))
  async importData(@UploadedFile() file, @Req() req, @Res() res) {
    const sheets = await nodexlsv.parse(file?.buffer);
    if (sheets.length) {
      const sheetFirst = sheets[0];
      const { name = 'sheet0', data = [] } = sheetFirst;
      const headers = data.shift() || [];
      const isCheckError = await this.monHocService.checkFormatFile(this.headersFormat, headers);
      if (isCheckError?.isError) {
        return res.status(HttpStatus.BAD_REQUEST).json({ isError: true, message: isCheckError?.message });
      }
      const results = await this.monHocService.insertMonHoc(data, req?.user);
      if (!results?.isError) {
        return res.json(results);
      }
      return res.status(HttpStatus.NOT_FOUND).json(results);
    }
  }
  @Post('import-dataV2')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'import data từ file xlsx' })
  @UseInterceptors(FileInterceptor('file', {}))
  @HttpCode(HttpStatus.OK)
  async importDataV2(@UploadedFile() file, @GetUser() user: UsersEntity) {
    const sheets = await nodexlsv.parse(file?.buffer);
    if (sheets.length) {
      const sheetFirst = sheets[0];
      const { name = 'sheet0', data = [] } = sheetFirst;
      const headers = data.shift() || [];
      const isCheckError = await this.monHocService.checkFormatFile(this.headersFormat, headers);
      if (isCheckError?.isError) {
        throw new BadRequestException(isCheckError?.message);
      }
      const results = await this.monHocService.insertMonHocV2(data, user);
      return { message: MONHOC_MESSAGE.IMPORT_SUCCESSFULLY, statusCode: HttpStatus.OK, contents: results };
    }
  }
}
