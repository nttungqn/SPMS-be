import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
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
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';
import { CreateChiTietGomNhomDTO } from './dto/create-chi-tiet-gom-nhom.dto';
import { FilterChiTietGomNhom } from './dto/filter-chi-tiet-gom-nhom';
import { CHITIETGOMNHOM_MESSAGE } from './../constant/constant';
import { FindAllChiTietGomNhomDtoResponse } from './dto/chi-tiet-gom-nhom.dto';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';
import { UpdateChiTietGomNhomDTO } from './dto/update-chi-tiet-gom-nhom.dto';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { FilterByNganhDaoTao } from './dto/filter-by-nganh-dao-tao.dto';
import { DeleteMultipleRows } from 'gom-nhom/dto/filter-gom-nhom';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { FilterByChiTietNganhDaoTao } from './dto/filter-by-chi-tiet-nganh-dao-tao.dto';
import { FilterByKeHoachGiangDay } from './dto/filter-by-ke-hoach-giang-day.dto';

@ApiTags('chi-tiet-gom-nhom')
@Controller('chi-tiet-gom-nhom')
export class ChiTietGomNhomController {
  constructor(private readonly chiTietGomNhomService: ChiTietGomNhomService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/nganh-dao-tao/:idNganhDaotao/khoa-tuyen/:khoa')
  async getAllSubject(
    @Param('idNganhDaotao', ParseIntPipe) idNganhDaoTao: number,
    @Param('khoa', ParseIntPipe) khoa: number,
    @Query() filter: FilterByNganhDaoTao
  ) {
    return await this.chiTietGomNhomService.getAllSubjects(khoa, idNganhDaoTao, filter);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT')
  async getAllSubjectByChiTietNDT(
    @Param('idCTNDT', ParseIntPipe) idCTNDT: number,
    @Query() filter: FilterByChiTietNganhDaoTao
  ) {
    return await this.chiTietGomNhomService.getAllSubjectsByChiTietNDT(idCTNDT, filter);
  }

  @Get('/ke-hoach-giang-day/:idKeHoachGiangDay')
  async getAllSubjectByKeHoachGiangDay(
    @Param('idKeHoachGiangDay', ParseIntPipe) idKeHoachGiangDay: number,
    @Query() filter: FilterByKeHoachGiangDay
  ) {
    return await this.chiTietGomNhomService.getAllSubjectByKeHoachGiangDay(idKeHoachGiangDay, filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách chi tiết gom nhom' })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllChiTietGomNhomDtoResponse })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChiTietGomNhom): Promise<any> {
    return await this.chiTietGomNhomService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: ChiTietGomNhomEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietGomNhomService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo chi tiết gom nhóm' })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() newData: CreateChiTietGomNhomDTO, @GetUser() user: UsersEntity): Promise<any> {
    const result = await this.chiTietGomNhomService.create(newData, user.id);
    return {
      response: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_SUCCESSFULLY,
      message: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedData: UpdateChiTietGomNhomDTO,
    @GetUser() user: UsersEntity
  ): Promise<any> {
    await this.chiTietGomNhomService.update(Number(id), updatedData, user.id);
    return new HttpException(CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number): Promise<any> {
    const user = req.user || {};
    await this.chiTietGomNhomService.delete(Number(id), user?.id);
    return new HttpException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một số gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Delete('/')
  async deleteMultipleRows(@Req() req, @Query() query: DeleteMultipleRows): Promise<any> {
    const user = req.user || {};
    await this.chiTietGomNhomService.deleteMultipleRows(query?.ids, user?.id);
    return new HttpException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa tất cả gom nhóm' })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Delete('/delete/all')
  async deleteAll(@Req() req): Promise<any> {
    const user = req.user || {};
    await this.chiTietGomNhomService.deleteAll(user?.id);
    return new HttpException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }
}
