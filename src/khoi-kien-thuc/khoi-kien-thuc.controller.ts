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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { filterKnowledgeBlock } from './dto/filter-khoi-kien-thuc.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('khoi-kien-thuc')
@Controller('khoi-kien-thuc')
export class KhoiKienThucController {
  constructor(private readonly khoiKienThucService: KhoiKienThucService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: filterKnowledgeBlock) {
    return this.khoiKienThucService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.khoiKienThucService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createKhoiKienThucDto: CreateKhoiKienThucDto, @Req() req) {
    const user = req.user || {};
    return this.khoiKienThucService.create({ ...createKhoiKienThucDto, createdBy: user?.ID });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKnowledgeBlockDto: UpdateKhoiKienThucDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.khoiKienThucService.update(id, { ...updateKnowledgeBlockDto, updatedBy: user?.ID });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.khoiKienThucService.remove(user?.ID, id);
    return new HttpException('OK', HttpStatus.OK);
  }
}
