import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'chuong-trinh-dao-tao/dto/Id.dto';
import { CtdtService } from './ctdt.service';
import { CreateNganhDaoTaoDto } from './dto/createNganhDaoTao.dto';
import { FilterNganhDaoTaoDto } from './dto/filterNganhDaoTao.dto';

@ApiTags('nganh-dao-tao')
@Controller('nganh-dao-tao')
export class CtdtController {
  constructor(private readonly nganhDaoTaoService: CtdtService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterNganhDaoTaoDto, @Res() res): Promise<any> {
    const { status, data } = await this.nganhDaoTaoService.findAll(filter);
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const { id } = param;
    const { status, data } = await this.nganhDaoTaoService.findById(Number(id));
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { status, data } = await this.nganhDaoTaoService.create({
      ...newData,
      createdBy: user?.ID,
      updatedBy: user?.ID
    });
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateNganhDaoTaoDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    const { status, data } = await this.nganhDaoTaoService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res.status(status).json(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    const { status, data } = await this.nganhDaoTaoService.delete(Number(id), user?.ID);
    return res.status(status).json(data);
  }
}
