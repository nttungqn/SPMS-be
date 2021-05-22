import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { HeDaotaoService } from './he-dao-tao.service';
import { CreateHeDaoTaoDto } from './dto/create-he-dao-tao.dto';
import { UpdateHeDaoTaoDto } from './dto/update-he-dao-tao.dto';
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
import { AuthGuard } from '@nestjs/passport';
import { HEDAOTAO_MESSAGE } from 'constant/constant';
import { FindAllHeDaoTaoResponse } from './Responses/find-all-he-dao-tao.response';
import { HeDaoTaoResponse } from './Responses/he-dao-tao.response';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';

@ApiTags('he-dao-tao')
@Controller('he-dao-tao')
export class HeDaotaoController {
  constructor(private readonly typeOfEducationService: HeDaotaoService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Tạo mới một hệ đào tạo' })
  @ApiCreatedResponse({ description: HEDAOTAO_MESSAGE.CREATE_HEDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: HEDAOTAO_MESSAGE.CREATE_HEDAOTAO_FAILED })
  @ApiConflictResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_EXIST })
  @ApiUnauthorizedResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_NOT_AUTHORIZED })
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTypeOfEducationDto: CreateHeDaoTaoDto) {
    return this.typeOfEducationService.create(createTypeOfEducationDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy danh sách các hệ đào tạo' })
  @ApiUnauthorizedResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_NOT_AUTHORIZED })
  @ApiOkResponse({ type: FindAllHeDaoTaoResponse })
  @Get()
  findAll() {
    return this.typeOfEducationService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin một hệ đào tạo' })
  @ApiUnauthorizedResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_ID_NOT_FOUND })
  @ApiOkResponse({ type: HeDaoTaoResponse })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfEducationService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật thông tin một hệ đào tạo' })
  @ApiUnauthorizedResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_ID_NOT_FOUND })
  @ApiOkResponse({ description: HEDAOTAO_MESSAGE.UPDATE_HEDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: HEDAOTAO_MESSAGE.UPDATE_HEDAOTAO_FAILED })
  @ApiConflictResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_EXIST })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTypeOfEducationDto: UpdateHeDaoTaoDto) {
    await this.typeOfEducationService.update(id, updateTypeOfEducationDto);
    return new HttpException(HEDAOTAO_MESSAGE.UPDATE_HEDAOTAO_SUCCESSFULLY, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một hệ đào tạo' })
  @ApiUnauthorizedResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_NOT_AUTHORIZED })
  @ApiNotFoundResponse({ description: HEDAOTAO_MESSAGE.HEDAOTAO_ID_NOT_FOUND })
  @ApiOkResponse({ description: HEDAOTAO_MESSAGE.DELETE_HEDAOTAO_SUCCESSFULLY })
  @ApiInternalServerErrorResponse({ description: HEDAOTAO_MESSAGE.DELETE_HEDAOTAO_FAILED })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.typeOfEducationService.remove(id);
    return new HttpException(HEDAOTAO_MESSAGE.DELETE_HEDAOTAO_SUCCESSFULLY, HttpStatus.OK);
  }
}
