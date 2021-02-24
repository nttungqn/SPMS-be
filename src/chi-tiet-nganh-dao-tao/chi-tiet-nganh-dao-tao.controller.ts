import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { CreateCTNganhDaoTaoDto } from './dto/createCTNganhDaoTao.dto';
import { FilterCTNganhDaoTaoDto } from './dto/filterCTNganhDaoTao.dto';

@Controller('chi-tiet-nganh-dao-tao')
export class ChiTietNganhDaoTaoController {
  constructor(private readonly chiTietNganhDaoTao: ChiTietNganhDaoTaoService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterCTNganhDaoTaoDto, @Res() res): Promise<any> {
    const { status, data } = await this.chiTietNganhDaoTao.findAll(filter);
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const { id } = param;
    const { status, data } = await this.chiTietNganhDaoTao.findById(Number(id));
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateCTNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { status, data } = await this.chiTietNganhDaoTao.create({
      ...newData,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(
    @Req() req,
    @Param() param: IdDto,
    @Body() updatedData: CreateCTNganhDaoTaoDto,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    const { status, data } = await this.chiTietNganhDaoTao.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    const { status, data } = await this.chiTietNganhDaoTao.delete(Number(id), user?.ID);
    return res.status(status).json(data);
  }
}
