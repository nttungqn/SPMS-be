import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ValidationPipe,
  Query,
  BadRequestException
} from '@nestjs/common';
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
  create(@Body(ValidationPipe) createPrerequisiteSubjectDto: CreatePrerequisiteSubjectDto, @Req() req) {
    const user = req.user || {};
    const { subject, preSubject } = createPrerequisiteSubjectDto;
    if (subject === preSubject) throw new BadRequestException();
    return this.prerequisiteSubjectService.create({
      ...createPrerequisiteSubjectDto,
      updatedBy: user?.ID,
      createdBy: user?.ID
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query(ValidationPipe) filter: FilterPrerequisiteSubject) {
    return this.prerequisiteSubjectService.findAllPrereSuject(null, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get('subject/:idSubject')
  findAllPrereSubject(
    @Param('idSubject', ParseIntPipe) id: number,
    @Query(ValidationPipe) filter: FilterPrerequisiteSubject
  ) {
    return this.prerequisiteSubjectService.findAllPrereSuject(id, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prerequisiteSubjectService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePrerequisiteSubjectDto: UpdatePrerequisiteSubjectDto,
    @Req() req
  ) {
    const user = req.user || {};
    return this.prerequisiteSubjectService.update(id, {
      ...updatePrerequisiteSubjectDto,
      updatedBy: user?.ID,
      updatedAt: new Date()
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    return this.prerequisiteSubjectService.remove(id, user?.ID);
  }
}
