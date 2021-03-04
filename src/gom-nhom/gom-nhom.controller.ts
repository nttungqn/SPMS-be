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
import { GomNhomService } from './gom-nhom.service';
import { CreateGomNhomDTO } from './dto/create-gom-nhom';
import { FilterGomNhom } from './dto/filter-gom-nhom';
import { IdDto } from './dto/Id.dto';

@ApiTags('gom-nhom')
@Controller('gom-nhom')
export class GomNhomController {
  constructor(private readonly gomNhomService: GomNhomService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get()
  async findAll(@Req() req, @Query() filter: FilterGomNhom): Promise<any> {
    return await this.gomNhomService.findAll(filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get(':id')
  async findById(@Req() req, @Param() param: IdDto): Promise<any> {
    const { id } = param;
    return await this.gomNhomService.findById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post()
  async create(@Req() req, @Body() newData: CreateGomNhomDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const result = await this.gomNhomService.create({
      ...newData,
      createdBy: user?.id,
      updatedBy: user?.id
    });
    return res.json({ result: result });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Put(':id')
  async update(@Req() req, @Param() param: IdDto, @Body() updatedData: CreateGomNhomDTO, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.gomNhomService.update(Number(id), { ...updatedData, updatedBy: user?.id });
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Delete(':id')
  async delete(@Req() req, @Param() param: IdDto, @Res() res): Promise<any> {
    const user = req.user || {};
    const { id } = param;
    await this.gomNhomService.delete(Number(id), user?.id);
    return res.status(HttpStatus.OK).json({ message: 'OK' });
  }
}
