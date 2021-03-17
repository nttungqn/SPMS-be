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
  HttpException,
  HttpStatus
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
import { GetUser } from 'auth/user.decorator';
import { CHUANDAURAMONHOC_MESSAGE } from 'constant/constant';
import { UsersEntity } from 'users/entity/user.entity';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';
import { CreateChuanDauRaMonHocDto } from './dto/create-chuan-dau-ra-mon-hoc.dto';
import { FilterChuanDauRaMonHocDto } from './dto/filter-chuan-dau-ra-mon-hoc.dto';
import { UpdateChuanDauRaMonHocDto } from './dto/update-chuan-dau-ra-mon-hoc.dto';

@ApiTags('chuan-dau-ra-mon-hoc')
@Controller('chuan-dau-ra-mon-hoc')
export class ChuanDauRaMonHocController {
  constructor(private readonly chuanDauRaMonHocService: ChuanDauRaMonHocService) {}

  @Get()
  findAll(@Query() fillter: FilterChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.findAll(fillter);
  }

  @Post()
  create(@Body() createChuanDauRaMonHocDto: CreateChuanDauRaMonHocDto, @GetUser() user: UsersEntity) {
    return this.chuanDauRaMonHocService.create(createChuanDauRaMonHocDto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.chuanDauRaMonHocService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChuanDauRaMonHocDto: UpdateChuanDauRaMonHocDto) {
    return this.chuanDauRaMonHocService.update(+id, updateChuanDauRaMonHocDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Xóa một chuẩn đầu ra' })
  @ApiUnauthorizedResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_FAILED })
  @ApiOkResponse({ description: CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_SUCCESSFULLY })
  @ApiNotFoundResponse({ description: CHUANDAURAMONHOC_MESSAGE.CHUANDAURAMONHOC_ID_NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: UsersEntity) {
    await this.chuanDauRaMonHocService.remove(id, user.id);
    return new HttpException(CHUANDAURAMONHOC_MESSAGE.DELETE_CHUANDAURAMONHOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
