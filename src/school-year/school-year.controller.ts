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
import { SchoolYearService } from './school-year.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('school-year')
@Controller('school-year')
export class SchoolYearController {
  constructor(private readonly schoolYearService: SchoolYearService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createSchoolYearDto: CreateSchoolYearDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSchoolYearDto: UpdateSchoolYearDto) {
    return this.schoolYearService.update(id, updateSchoolYearDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schoolYearService.remove(+id);
  }
}
