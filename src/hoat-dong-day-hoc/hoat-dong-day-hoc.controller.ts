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
import { HoatDongDayHocService } from './hoat-dong-day-hoc.service';
import { CreateHoatDongDayHocDTO } from './dto/create-hoat-dong-day-hoc';
import { FilterHoatDongDayHoc } from './dto/filter-hoat-đong-day-hoc';
import { IdDto } from './dto/Id.dto';

@ApiTags('hoat-dong-day-hoc')
@Controller('hoat-dong-day-hoc')
export class HoatDongDayHocController {
  constructor(private readonly hoatDongDayHocService: HoatDongDayHocService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterHoatDongDayHoc): Promise<any> {
    return await this.hoatDongDayHocService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.hoatDongDayHocService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateHoatDongDayHocDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.hoatDongDayHocService.create({
      ...newData,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateHoatDongDayHocDTO,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.hoatDongDayHocService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.hoatDongDayHocService.delete(Number(id), user?.ID);
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
