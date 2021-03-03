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
  UseGuards
} from '@nestjs/common';
import { NamHocService } from './nam-hoc.service';
import { CreateNamHocDto } from './dto/create-nam-hoc.dto';
import { UpdateNamHocDto } from './dto/update-nam-hoc.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('nam-hoc')
@Controller('nam-hoc')
export class NamHocController {
  constructor(private readonly schoolYearService: NamHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createSchoolYearDto: CreateNamHocDto) {
    return this.schoolYearService.create(createSchoolYearDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll() {
    return this.schoolYearService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schoolYearService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSchoolYearDto: UpdateNamHocDto) {
    return this.schoolYearService.update(id, updateSchoolYearDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schoolYearService.remove(+id);
  }
}
