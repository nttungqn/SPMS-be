import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';
import { AuthGuard } from '@nestjs/passport';
import { RowSoKhopNganhDaoTao } from './dto/row-so-khop.dto';
import { RolesGuard } from 'guards/roles.guard';
import { UpdateSoKhopRequestBody } from './body/update-so-kho-request-body';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';
import { SOKHOP_MESSAGE } from 'constant/constant';

@ApiTags('so-khop')
@Controller('so-khop')
export class SoKhopController {
  constructor(private readonly soKhopService: SoKhopService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin so khớp môn học của 1 ngành đào tạo trong 2 năm' })
  @ApiOkResponse({ description: 'OK', type: [RowSoKhopNganhDaoTao] })
  @Get('/nganh-dao-tao/:idNganhDaoTao')
  findOne(@Query() filter: FilterSoKhopNganhDaoTao, @Param('idNganhDaoTao') id: number) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = filter;
    if (Number(khoaTuyenNam1) >= Number(khoaTuyenNam2)) {
      throw new BadRequestException();
    }
    return this.soKhopService.soKhopNganhDaoTao(id, filter);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Lấy thông tin so khớp môn học của 1 ngành đào tạo trong 2 năm' })
  @ApiOkResponse({ description: 'OK', type: [RowSoKhopNganhDaoTao] })
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT1/:idCTNDT2')
  soKhopList(@Param('idCTNDT1') idCTNDT1: number,@Param('idCTNDT2') idCTNDT2: number) {
    return this.soKhopService.soKhopChiTietNganhDaoTao(idCTNDT1,idCTNDT2);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật so khớp môn học của 1 ngành đào tạo trong 2 năm' })
  @ApiOkResponse({ description: SOKHOP_MESSAGE.UPDATE_MONHOCTRUOC_SUCCESSFULLY })
  @Put('/nganh-dao-tao/:id')
  async updateSoKhopMonHoc(
    @Param('id') id: number,
    @Body() body: UpdateSoKhopRequestBody,
    @GetUser() user: UsersEntity
  ) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = body;
    if (khoaTuyenNam1 != khoaTuyenNam2 - 1) {
      throw new BadRequestException();
    }
    await this.soKhopService.updateSoKhopMonHoc(id, body, user);
    return new HttpException(SOKHOP_MESSAGE.UPDATE_MONHOCTRUOC_SUCCESSFULLY, HttpStatus.OK);
  }
}
