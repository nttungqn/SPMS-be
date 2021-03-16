import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';
import { CreateChiTietGomNhomDTO } from './dto/create-chi-tiet-gom-nhom.dto';
import { FilterChiTietGomNhom } from './dto/filter-chi-tiet-gom-nhom';
import { CHITIETGOMNHOM_MESSAGE } from './../constant/constant';
import { FindAllChiTietGomNhomDtoResponse } from './dto/chi-tiet-gom-nhom.dto';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';
import { UpdateChiTietGomNhomDTO } from './dto/update-chi-tiet-gom-nhom.dto';

@ApiTags('chi-tiet-gom-nhom')
@Controller('chi-tiet-gom-nhom')
export class ChiTietGomNhomController {
  constructor(private readonly chiTietGomNhomService: ChiTietGomNhomService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách chi tiết gom nhom' })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllChiTietGomNhomDtoResponse })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChiTietGomNhom): Promise<any> {
    return await this.chiTietGomNhomService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: ChiTietGomNhomEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietGomNhomService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo chi tiết gom nhóm' })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.CREATE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Post()
  async create(@Req() req, @Body() newData: CreateChiTietGomNhomDTO): Promise<any> {
    const user = req.user || {};
    return await this.chiTietGomNhomService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() updatedData: UpdateChiTietGomNhomDTO): Promise<any> {
    const user = req.user || {};
    await this.chiTietGomNhomService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return new HttpException(CHITIETGOMNHOM_MESSAGE.UPDATE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHITIETGOMNHOM_MESSAGE.CHITIETGOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_FAILED })
  @ApiOkResponse({ description: CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param() id: number): Promise<any> {
    const user = req.user || {};
    await this.chiTietGomNhomService.delete(Number(id), user?.id);
    return new HttpException(CHITIETGOMNHOM_MESSAGE.DELETE_CHITIETGOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }
}
