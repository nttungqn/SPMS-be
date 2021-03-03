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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterLoaiKhoiKienThuc } from './dto/filter-loai-khoi-kien-thuc.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('loai-khoi-kien-thuc')
@Controller('loai-khoi-kien-thuc')
export class LoaiKhoiKienThucController {
  constructor(private readonly typeOfKnowledgeBlockService: LoaiKhoiKienThucService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: FilterLoaiKhoiKienThuc) {
    return this.typeOfKnowledgeBlockService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfKnowledgeBlockService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createTypeOfKnowledgeBlockDto: CreateLoaiKhoiKienThucDto, @Req() req) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.create({
      ...createTypeOfKnowledgeBlockDto,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeOfKnowledgeBlockDto: UpdateLoaiKhoiKienThucDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.update(id, { ...updateTypeOfKnowledgeBlockDto, updatedBy: user?.ID });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.remove(id, user?.ID);
    return new HttpException('OK', HttpStatus.OK);
  }
}
