import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';
import { GetSyllabusFilterDto } from './dto/filter-syllabus.dto';

@ApiTags('Syllabus')
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createSyllabusDto: CreateSyllabusDto, @Req() req): Promise<Syllabus> {
    const user = req.user || {};
    return this.syllabusService.create({
      ...createSyllabusDto,
      author: user?.ID,
      updateBy: user?.ID,
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Query(ValidationPipe) filter: GetSyllabusFilterDto): Promise<Syllabus[] | any> {
    return await this.syllabusService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number): Promise<Syllabus> {
    return this.syllabusService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSyllabusDto: UpdateSyllabusDto, @Req() req) {
    const user = req.user || {};
    await this.syllabusService.update(id, { ...updateSyllabusDto, updateBy: user?.ID, updatedAt: new Date() });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.syllabusService.remove(id, user?.ID);
    return new HttpException('OK', HttpStatus.OK);
  }
}
