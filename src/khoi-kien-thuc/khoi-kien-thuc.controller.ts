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
  Req,
  HttpException,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { KhoiKienThucService } from './khoi-kien-thuc.service';
import { CreateKhoiKienThucDto } from './dto/create-khoi-kien-thuc.dto';
import { UpdateKhoiKienThucDto } from './dto/update-khoi-kien-thuc.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { filterKnowledgeBlock } from './dto/filter-khoi-kien-thuc.dto';
import { AuthGuard } from '@nestjs/passport';
import { KHOIKIENTHUC_MESSAGE } from 'constant/constant';
import { KhoiKienThucResponse } from './Responses/khoi-kien-thuc.response';
import { FindAllKhoiKienThuc } from './Responses/find-all-khoi-kien-thuc.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('khoi-kien-thuc')
@Controller('khoi-kien-thuc')
export class KhoiKienThucController {
  constructor(private readonly khoiKienThucService: KhoiKienThucService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các khối kiến thức' })
  @ApiUnauthorizedResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllKhoiKienThuc })
  @Get()
  findAll(@Query() filter: filterKnowledgeBlock) {
    return this.khoiKienThucService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một khối kiến thức' })
  @ApiUnauthorizedResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND })
  @ApiOkResponse({ type: KhoiKienThucResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.khoiKienThucService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới một khối kiến thức' })
  @ApiCreatedResponse({ description: KHOIKIENTHUC_MESSAGE.CREATE_KHOIKIENTHUC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KHOIKIENTHUC_MESSAGE.CREATE_KHOIKIENTHUC_FAILED })
  @ApiConflictResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_EXIST })
  @ApiUnauthorizedResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_NOT_AUTHORIZED })
  @Post()
  async create(@Body(ValidationPipe) createKhoiKienThucDto: CreateKhoiKienThucDto, @Req() req) {
    const user = req.user || {};
    await this.khoiKienThucService.create({ ...createKhoiKienThucDto, createdBy: user?.id, updatedBy: user?.id });
    return new HttpException(KHOIKIENTHUC_MESSAGE.CREATE_KHOIKIENTHUC_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin một khối kiến thức' })
  @ApiUnauthorizedResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiOkResponse({ description: KHOIKIENTHUC_MESSAGE.UPDATE_KHOIKIENTHUC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KHOIKIENTHUC_MESSAGE.UPDATE_KHOIKIENTHUC_FAILED })
  @ApiConflictResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_EXIST })
  @ApiNotFoundResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKnowledgeBlockDto: UpdateKhoiKienThucDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.khoiKienThucService.update(id, { ...updateKnowledgeBlockDto, updatedBy: user?.id });
    return new HttpException(KHOIKIENTHUC_MESSAGE.UPDATE_KHOIKIENTHUC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một khối kiến thức' })
  @ApiUnauthorizedResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiOkResponse({ description: KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_FAILED })
  @ApiNotFoundResponse({ description: KHOIKIENTHUC_MESSAGE.KHOIKIENTHUC_ID_NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.khoiKienThucService.remove(user?.id, id);
    return new HttpException(KHOIKIENTHUC_MESSAGE.DELETE_KHOIKIENTHUC_SUCCESSFULLY, HttpStatus.OK);
  }
}
