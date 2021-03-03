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
import { MonHocTienQuyetService } from './mon-hoc-tien-quyet.service';
import { CreateMonHocTienQuyetDto } from './dto/create-mon-hoc-tien-quyet.dto';
import { UpdateMonHocKienQuyetDto } from './dto/update-mon-hoc-tien-quyet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilterMonHocKienQuyet } from './dto/filter-mon-hoc-tien-quyet.dto';

@ApiTags('mon-hoc-tien-quyet')
@Controller('mon-hoc-tien-quyet')
export class MonHocTienQuyetController {
  constructor(private readonly prerequisiteSubjectService: MonHocTienQuyetService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  create(@Body(ValidationPipe) createPrerequisiteSubjectDto: CreateMonHocTienQuyetDto, @Req() req) {
    const user = req.user || {};
    const { monHoc, monHocTruoc } = createPrerequisiteSubjectDto;
    if (monHoc === monHocTruoc) throw new BadRequestException();
    return this.prerequisiteSubjectService.create({
      ...createPrerequisiteSubjectDto,
      updatedBy: user?.ID,
      createdBy: user?.ID
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query(ValidationPipe) filter: FilterMonHocKienQuyet) {
    return this.prerequisiteSubjectService.findAllPrereSuject(null, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get('mon-hoc/:idMonHoc')
  findAllPrereSubject(
    @Param('idMonHoc', ParseIntPipe) id: number,
    @Query(ValidationPipe) filter: FilterMonHocKienQuyet
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
    @Body(ValidationPipe) updatePrerequisiteSubjectDto: UpdateMonHocKienQuyetDto,
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
