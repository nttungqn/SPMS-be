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
import { MonHocService } from './mon-hoc.service';
import { CreateMonHocDto } from './dto/createMonHoc';
import { FilterMonHoc } from './dto/filterMonHoc.dto';
import { IdDto } from './dto/Id.dto';

@ApiTags('mon-hoc')
@Controller('mon-hoc')
export class MonHocController {
  constructor(private readonly monHocService: MonHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterMonHoc): Promise<any> {
    return await this.monHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.monHocService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateMonHocDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.monHocService.create({
      ...newData,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateMonHocDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.monHocService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.monHocService.delete(Number(id), user?.ID);
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
