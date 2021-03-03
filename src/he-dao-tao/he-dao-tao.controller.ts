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
import { HeDaotaoService } from './he-dao-tao.service';
import { CreateHeDaoTaoDto } from './dto/create-he-dao-tao.dto';
import { UpdateHeDaoTaoDto } from './dto/update-he-dao-tao.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('he-dao-tao')
@Controller('he-dao-tao')
export class HeDaotaoController {
  constructor(private readonly typeOfEducationService: HeDaotaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createTypeOfEducationDto: CreateHeDaoTaoDto) {
    return this.typeOfEducationService.create(createTypeOfEducationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll() {
    return this.typeOfEducationService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfEducationService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTypeOfEducationDto: UpdateHeDaoTaoDto) {
    return this.typeOfEducationService.update(id, updateTypeOfEducationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfEducationService.remove(id);
  }
}
