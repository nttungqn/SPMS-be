import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards, Req, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { PrerequisiteSubjectService } from './prerequisite-subject.service';
import { CreatePrerequisiteSubjectDto } from './dto/create-prerequisite-subject.dto';
import { UpdatePrerequisiteSubjectDto } from './dto/update-prerequisite-subject.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterPrerequisiteSubject } from './dto/filter-prerequisite-subject.dto';

@ApiTags('prerequisite-subject')
@Controller('prerequisite-subject')
export class PrerequisiteSubjectController {
  constructor(private readonly prerequisiteSubjectService: PrerequisiteSubjectService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  create(@Body(ValidationPipe) createPrerequisiteSubjectDto: CreatePrerequisiteSubjectDto,@Req() req) {
    const user = req.user || {};
    const {subject,preSubject}=createPrerequisiteSubjectDto;
    if(subject===preSubject)
      throw new BadRequestException();
    return this.prerequisiteSubjectService.create({...createPrerequisiteSubjectDto,updatedBy:user?.ID,createdBy:user?.ID});
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter:FilterPrerequisiteSubject) {
    return this.prerequisiteSubjectService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':idSubject/prevs')
  findAllPrevSuject(@Param('idSubject',ParseIntPipe) id: number) {
    return this.prerequisiteSubjectService.findAllPrevSuject(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':idSubject/parallels')
  findAllParaSubject(@Param('idSubject',ParseIntPipe) id: number){
    return this.prerequisiteSubjectService.findAllParaSuject(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body(ValidationPipe) updatePrerequisiteSubjectDto: UpdatePrerequisiteSubjectDto,@Req() req) {
    const user = req.user || {};
    return this.prerequisiteSubjectService.update(id, {...updatePrerequisiteSubjectDto,updatedBy:user?.ID,updatedAt:new Date()});
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number,@Req() req) {
    const user = req.user || {};
    return this.prerequisiteSubjectService.remove(id,user?.ID);
  }
}
