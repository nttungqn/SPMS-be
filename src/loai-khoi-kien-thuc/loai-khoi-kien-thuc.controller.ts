import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  ValidationPipe
} from '@nestjs/common';
import { LoaiKhoiKienThucService } from './loai-khoi-kien-thuc.service';
import { CreateLoaiKhoiKienThucDto } from './dto/create-loai-khoi-kien-thuc.dto';
import { UpdateLoaiKhoiKienThucDto } from './dto/update-loai-khoi-kien-thuc.dto';
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
import { FilterLoaiKhoiKienThuc } from './dto/filter-loai-khoi-kien-thuc.dto';
import { AuthGuard } from '@nestjs/passport';
import { LOAIKHOIKIENTHUC_MESSAGE } from 'constant/constant';
import { FindAllLoaiKhoiKienThuc } from './Responses/find-all-loai-khoi-kien-thuc.response';
import { LoaiKhoiKienThucDetailResponse } from './Responses/loai-khoi-kien-thuc.detail.response';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('loai-khoi-kien-thuc')
@Controller('loai-khoi-kien-thuc')
export class LoaiKhoiKienThucController {
  constructor(private readonly typeOfKnowledgeBlockService: LoaiKhoiKienThucService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các loại khối kiến thức' })
  @ApiUnauthorizedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllLoaiKhoiKienThuc })
  @Get()
  findAll(@Query() filter: FilterLoaiKhoiKienThuc) {
    return this.typeOfKnowledgeBlockService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một loại khối kiến thức' })
  @ApiUnauthorizedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiOkResponse({ type: LoaiKhoiKienThucDetailResponse })
  @ApiNotFoundResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfKnowledgeBlockService.findDetail(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới một loại khối kiến thức' })
  @ApiCreatedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.CREATE_LOAIKHOIKIENTHUC_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.CREATE_LOAIKHOIKIENTHUC_FAILED })
  @ApiConflictResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_EXIST })
  @ApiUnauthorizedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_NOT_AUTHORIZED })
  @Post()
  async create(@Body(ValidationPipe) createTypeOfKnowledgeBlockDto: CreateLoaiKhoiKienThucDto, @Req() req) {
    const user = req.user || {};
    const result = await this.typeOfKnowledgeBlockService.create({
      ...createTypeOfKnowledgeBlockDto,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return {
      response: LOAIKHOIKIENTHUC_MESSAGE.CREATE_LOAIKHOIKIENTHUC_SUCCESSFULLY,
      message: LOAIKHOIKIENTHUC_MESSAGE.CREATE_LOAIKHOIKIENTHUC_SUCCESSFULLY,
      status: HttpStatus.CREATED,
      id: result.id
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin một loại khối kiến thức' })
  @ApiUnauthorizedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.UPDATE_LOAIKHOIKIENTHUC_FAILED })
  @ApiConflictResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_EXIST })
  @ApiNotFoundResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND })
  @ApiOkResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.UPDATE_LOAIKHOIKIENTHUC_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeOfKnowledgeBlockDto: UpdateLoaiKhoiKienThucDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.update(id, { ...updateTypeOfKnowledgeBlockDto, updatedBy: user?.id });
    return new HttpException(LOAIKHOIKIENTHUC_MESSAGE.UPDATE_LOAIKHOIKIENTHUC_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một loại khối kiến thức' })
  @ApiUnauthorizedResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_FAILED })
  @ApiNotFoundResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.LOAIKHOIKIENTHUC_ID_NOT_FOUND })
  @ApiOkResponse({ description: LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_SUCCESSFULLY })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.remove(id, user?.id);
    return new HttpException(LOAIKHOIKIENTHUC_MESSAGE.DELETE_LOAIKHOIKIENTHUC_SUCCESSFULLY, HttpStatus.OK);
  }
}
