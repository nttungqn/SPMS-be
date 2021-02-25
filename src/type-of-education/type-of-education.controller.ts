import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UsePipes ,ValidationPipe, UseGuards} from '@nestjs/common';
import { TypeOfEducationService } from './type-of-education.service';
import { CreateTypeOfEducationDto } from './dto/create-type-of-education.dto';
import { UpdateTypeOfEducationDto } from './dto/update-type-of-education.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('type-of-education')
@Controller('type-of-education')
export class TypeOfEducationController {
  constructor(private readonly typeOfEducationService: TypeOfEducationService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTypeOfEducationDto: CreateTypeOfEducationDto) {
    return this.typeOfEducationService.create(createTypeOfEducationDto);
  }


  @Get()
  findAll() {
    return this.typeOfEducationService.findAll();
  }


  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.typeOfEducationService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(@Param('id',ParseIntPipe) id: number, @Body() updateTypeOfEducationDto: UpdateTypeOfEducationDto) {
    return this.typeOfEducationService.update(id, updateTypeOfEducationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.typeOfEducationService.remove(id);
  }
}
