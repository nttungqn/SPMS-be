import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { KnowledgeBlockService } from './knowledge-block.service';
import { CreateKnowledgeBlockDto } from './dto/create-knowledge-block.dto';
import { UpdateKnowledgeBlockDto } from './dto/update-knowledge-block.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { filterKnowledgeBlock } from './dto/filter-knowledge-block.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('knowledge-block')
@Controller('knowledge-block')
export class KnowledgeBlockController {
  constructor(private readonly knowledgeBlockService: KnowledgeBlockService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  findAll(@Query() filter: filterKnowledgeBlock) {
    return this.knowledgeBlockService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.knowledgeBlockService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Body(ValidationPipe) createKnowledgeBlockDto: CreateKnowledgeBlockDto, @Req() req) {
    const user = req.user || {};
    return this.knowledgeBlockService.create({ ...createKnowledgeBlockDto, createdBy: user?.ID });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKnowledgeBlockDto: UpdateKnowledgeBlockDto,
    @Req() req
  ) {
    const user = req.user || {};
    await this.knowledgeBlockService.update(id, { ...updateKnowledgeBlockDto, updatedBy: user?.ID });
    return new HttpException('OK', HttpStatus.OK);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user = req.user || {};
    await this.knowledgeBlockService.remove(user?.ID, id);
    return new HttpException('OK', HttpStatus.OK);
  }
}
