import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
  ValidationPipe
} from '@nestjs/common';
import { TypeOfKnowledgeBlockService } from './type-of-knowledge-block.service';
import { CreateTypeOfKnowledgeBlockDto } from './dto/create-type-of-knowledge-block.dto';
import { UpdateTypeOfKnowledgeBlockDto } from './dto/update-type-of-knowledge-block.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterTypeOfKnowledgeBlock } from './dto/filter-type-of-knowledge-block.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Loai-Khoi-Kien-Thuc')
@Controller('Loai-Khoi-Kien-Thuc')
export class TypeOfKnowledgeBlockController {
  constructor(private readonly typeOfKnowledgeBlockService: TypeOfKnowledgeBlockService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: FilterTypeOfKnowledgeBlock) {
    return this.typeOfKnowledgeBlockService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeOfKnowledgeBlockService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createTypeOfKnowledgeBlockDto: CreateTypeOfKnowledgeBlockDto, @Req() req) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.create({
      ...createTypeOfKnowledgeBlockDto,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeOfKnowledgeBlockDto: UpdateTypeOfKnowledgeBlockDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.update(id, { ...updateTypeOfKnowledgeBlockDto, updatedBy: user?.ID });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.typeOfKnowledgeBlockService.remove(id, user?.ID);
    return new HttpException('OK', HttpStatus.OK);
  }
}
