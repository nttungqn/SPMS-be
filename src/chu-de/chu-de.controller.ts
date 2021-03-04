import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChuDeService } from './chu-de.service';
import { CreateChuDeDTO } from './dto/create-chu-de';
import { FilterChuDe } from './dto/filter-chu-de';
import { IdDto } from './dto/Id.dto';

@ApiTags('chu-de')
@Controller('chu-de')
export class ChuDeController {
  constructor(private readonly chuDeService: ChuDeService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterChuDe): Promise<any> {
    return await this.chuDeService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chuDeService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateChuDeDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.chuDeService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateChuDeDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.chuDeService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.chuDeService.delete(Number(id), user?.id);
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
