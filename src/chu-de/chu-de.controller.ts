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
import { CreateChuDeDto } from './dto/create-chu-de';
import { FilterChuDe } from './dto/filter-chu-de';
import { FindAllChuDeDtoResponse } from './dto/chu-de-response';
import { ChuDeEntity } from './entity/chu-de.entity';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { UpdateChuDeDTO } from './dto/update-chu-de';

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
  async findAll(@Query() filter: FilterChuDe): Promise<any> {
    return await this.chuDeService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy chi tiết chủ đề' })
  @ApiNotFoundResponse({ description: CHUDE_MESSAGE.CHUDE_ID_NOT_FOUND })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiOkResponse({ type: ChuDeEntity })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<any> {
    return await this.chuDeService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo chi tiết chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.CREATE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.CREATE_CHUDE_SUCCESSFULLY })
  @Post()
  async create(@Body() newData: CreateChuDeDto, @GetUser() user: UsersEntity): Promise<any> {
    await this.chuDeService.create(newData, user.id);
    return new HttpException(CHUDE_MESSAGE.CREATE_CHUDE_SUCCESSFULLY, HttpStatus.CREATED);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.UPDATE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.UPDATE_CHUDE_SUCCESSFULLY })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedData: UpdateChuDeDTO,
    @GetUser() user: UsersEntity
  ): Promise<any> {
    await this.chuDeService.update(id, updatedData, user.id);
    return new HttpException(CHUDE_MESSAGE.UPDATE_CHUDE_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa chủ đề' })
  @ApiUnauthorizedResponse({ description: CHUDE_MESSAGE.CHUDE_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUDE_MESSAGE.DELETE_CHUDE_FAILED })
  @ApiOkResponse({ description: CHUDE_MESSAGE.DELETE_CHUDE_SUCCESSFULLY })
  @Delete(':id')
  async delete(@Param('id') id: number, @GetUser() user: UsersEntity): Promise<any> {
    await this.chuDeService.delete(Number(id), user?.id);
    return new HttpException(CHUDE_MESSAGE.DELETE_CHUDE_SUCCESSFULLY, HttpStatus.OK);
  }
}
