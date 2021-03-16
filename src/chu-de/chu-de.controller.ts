import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
import { CHUDE_MESSAGE } from 'constant/constant';
import { ChuDeService } from './chu-de.service';
import { CreateChuDeDTO } from './dto/create-chu-de';
import { FilterChuDe } from './dto/filter-chu-de';
import { FindAllChuDeDtoResponse } from './dto/chu-de-response';
import { ChuDeEntity } from './entity/chu-de.entity';

@ApiTags('chu-de')
@Controller('chu-de')
export class ChuDeController {
  constructor(private readonly chuDeService: ChuDeService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách chi tiết chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllChuDeDtoResponse })
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChuDe): Promise<any> {
    return await this.chuDeService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết chủ đề' })
  @ApiNotFoundResponse({ description: CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiOkResponse({ type: ChuDeEntity })
  @Get(':id')
  async findById(@Req() req, @Param() id: number): Promise<any> {
    return await this.chuDeService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo chi tiết chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.CREATE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.CREATE_CHUDE_SUCCESSFULLY })
  @Post()
  async create(@Req() req, @Body() newData: CreateChuDeDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.chuDeService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.UPDATE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.UPDATE_CHUDE_SUCCESSFULLY })
  @Put(':id')
  async update(@Req() req, @Param() id: number, @Body() updatedData: CreateChuDeDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    await this.chuDeService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return new HttpException(CHUDE_MESSAGE.UPDATE_CHUDE_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.DELETE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.DELETE_CHUDE_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param() id: number, @Res() res): Promise<any> {
    const user = req.user || {};
    await this.chuDeService.delete(Number(id), user?.id);
    return new HttpException(CHUDE_MESSAGE.DELETE_CHUDE_SUCCESSFULLY, HttpStatus.OK);
  }
}
