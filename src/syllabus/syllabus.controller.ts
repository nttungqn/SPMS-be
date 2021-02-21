import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe,UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { Syllabus } from './entity/syllabus.entity';

@ApiTags('Syllabus')
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  create(@Body(ValidationPipe) createSyllabusDto: CreateSyllabusDto,@Req() req):Promise<Syllabus> {
    createSyllabusDto.idUser=req.user.ID;
    return this.syllabusService.create(createSyllabusDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('token')
  @Get()
  findAll():Promise<Syllabus[]> {
    return this.syllabusService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id',new ParseIntPipe()) id: number):Promise<Syllabus> {
    return this.syllabusService.findOne(id);
  }

  @Put(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateSyllabusDto: UpdateSyllabusDto) {
    return this.syllabusService.update(+id, updateSyllabusDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.syllabusService.remove(+id);
  }
}
