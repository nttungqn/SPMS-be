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
import { ChiTietKeHoachService } from './chi-tiet-ke-hoach.service';
import { CreateChiTietKeHoachDto } from './dto/create-chi-tiet-ke-hoach.dto';
import { UpdateChiTietKeHoachDto } from './dto/update-chi-tiet-ke-hoach.dto';
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
import { BaseFilterDto } from './dto/filter-chi-tiet-ke-hoach.dto';
import { CHITIETKEHOACH_MESSAGE } from 'constant/constant';
import { FindAllChiTietKeHoachDtoResponse } from './dto/chi-tiet-ke-hoach.dto.response';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';

@ApiTags('chi-tiet-ke-hoach')
@Controller('chi-tiet-ke-hoach')
export class ChiTietKeHoachController {
  constructor(private readonly chiTietKeHoachService: ChiTietKeHoachService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllChiTietKeHoachDtoResponse })
  @Get()
  findAll(@Query() filter: BaseFilterDto) {
    return this.chiTietKeHoachService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_NOT_AUTHORIZED })
  @ApiOkResponse({ type: ChiTietKeHoachEntity })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chiTietKeHoachService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo một chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_NOT_AUTHORIZED })
  @ApiConflictResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_FOREIGN_KEY_CONFLICT })
  @ApiInternalServerErrorResponse({ description: CHITIETKEHOACH_MESSAGE.CREATE_CHITIETKEHOACH_FAILED })
  @ApiOkResponse({ type: CreateChiTietKeHoachDto })
  @Post()
  async create(@Body() CreateChiTietKeHoachDto: CreateChiTietKeHoachDto, @Req() req) {
    const user = req.user || {};
    return await this.chiTietKeHoachService.create({
      ...CreateChiTietKeHoachDto,
      updatedBy: user?.id,
      createdBy: user?.id
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật một chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_FAILED })
  @ApiOkResponse({ description: CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChiTietKeHoachDto: UpdateChiTietKeHoachDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.chiTietKeHoachService.update(id, {
      ...updateChiTietKeHoachDto,
      updatedAt: new Date(),
      updatedBy: user?.id
    });
    return new HttpException(CHITIETKEHOACH_MESSAGE.UPDATE_CHITIETKEHOACH_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một chi tiết kế hoạch' })
  @ApiUnauthorizedResponse({ description: CHITIETKEHOACH_MESSAGE.CHITIETKEHOACH_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_FAILED })
  @ApiOkResponse({ description: CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.chiTietKeHoachService.remove(id, user?.id);
    return new HttpException(CHITIETKEHOACH_MESSAGE.DELETE_CHITIETKEHOACH_SUCCESSFULLY, HttpStatus.OK);
  }
}
