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
import { GomNhomService } from './gom-nhom.service';
import { CreateGomNhomDTO } from './dto/create-gom-nhom';
import { FilterGomNhom } from './dto/filter-gom-nhom';
import { GOMNHOM_MESSAGE } from 'constant/constant';
import { FindAllGomNhomDtoResponse } from './dto/gom-nhom-response';
import { GomNhomEntity } from './entity/gom-nhom.entity';

@ApiTags('gom-nhom')
@Controller('gom-nhom')
export class GomNhomController {
  constructor(private readonly gomNhomService: GomNhomService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách gom nhom' })
  @ApiUnauthorizedResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllGomNhomDtoResponse })
  @Get()
  async findAll(@Query() filter: FilterGomNhom): Promise<any> {
    return await this.gomNhomService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết gom nhóm' })
  @ApiNotFoundResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_NOT_AUTHORIZED })
  @ApiOkResponse({ type: GomNhomEntity })
  @Get(':id')
  async findById(@Param() id: number): Promise<any> {
    return await this.gomNhomService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo gom nhóm' })
  @ApiUnauthorizedResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: GOMNHOM_MESSAGE.CREATE_GOMNHOM_FAILED })
  @ApiOkResponse({ description: GOMNHOM_MESSAGE.CREATE_GOMNHOM_SUCCESSFULLY })
  @Post()
  async create(@Req() req, @Body() newData: CreateGomNhomDTO): Promise<any> {
    const user = req.user || {};
    return await this.gomNhomService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật gom nhóm' })
  @ApiNotFoundResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: GOMNHOM_MESSAGE.UPDATE_GOMNHOM_FAILED })
  @ApiOkResponse({ description: GOMNHOM_MESSAGE.UPDATE_GOMNHOM_SUCCESSFULLY })
  @Put(':id')
  async update(@Req() req, @Param('id') id: number, @Body() updatedData: CreateGomNhomDTO): Promise<any> {
    const user = req.user || {};
    await this.gomNhomService.update(Number(id), {
      ...updatedData,
      updatedBy: user?.id
    });
    return new HttpException(GOMNHOM_MESSAGE.UPDATE_GOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa gom nhóm' })
  @ApiNotFoundResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: GOMNHOM_MESSAGE.GOMNHOM_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: GOMNHOM_MESSAGE.DELETE_GOMNHOM_FAILED })
  @ApiOkResponse({ description: GOMNHOM_MESSAGE.DELETE_GOMNHOM_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Req() req, @Param() id: number): Promise<any> {
    const user = req.user || {};
    await this.gomNhomService.delete(Number(id), user?.id);
    return new HttpException(GOMNHOM_MESSAGE.DELETE_GOMNHOM_SUCCESSFULLY, HttpStatus.OK);
  }
}
