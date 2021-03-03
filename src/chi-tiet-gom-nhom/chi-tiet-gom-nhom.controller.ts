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
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';
import { CreateChiTietGomNhomDTO } from './dto/create-chi-tiet-gom-nhom';
import { BaseFilterDto } from './dto/filter-chi-tiet-gom-nhom';
import { IdDto } from './dto/Id.dto';

@ApiTags('chi-tiet-gom-nhom')
@Controller('chi-tiet-gom-nhom')
export class ChiTietGomNhomController {
  constructor(private readonly chiTietGomNhomService: ChiTietGomNhomService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: BaseFilterDto): Promise<any> {
    return await this.chiTietGomNhomService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.chiTietGomNhomService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateChiTietGomNhomDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.chiTietGomNhomService.create({
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
    @Body() updatedData: CreateChiTietGomNhomDTO,
    @Res() res
  ): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.chiTietGomNhomService.update(Number(id), { ...updatedData, updatedBy: user?.ID });
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.chiTietGomNhomService.delete(Number(id), user?.ID);
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
