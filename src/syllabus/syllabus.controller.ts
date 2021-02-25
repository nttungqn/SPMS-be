import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe,UseGuards, Req, ParseIntPipe, Query, UsePipes, ConflictException, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';
import { GetSyllabusFilterDto } from './dto/filter-syllabus.dto';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Syllabus')
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createSyllabusDto: CreateSyllabusDto,@Req() req):Promise<Syllabus> {
    return this.syllabusService.create(req.user?.ID,createSyllabusDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('token')
  @Get()
  async findAll(@Query(ValidationPipe) filter:GetSyllabusFilterDto):Promise<Syllabus[]|any> {
    return await this.syllabusService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id',new ParseIntPipe()) id: number):Promise<Syllabus> {
    return this.syllabusService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateSyllabusDto: UpdateSyllabusDto,@Req() req) {
    return this.syllabusService.update(id,req.user.ID,updateSyllabusDto);
  }

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number) {
    return await this.syllabusService.remove(id);
  }
}
