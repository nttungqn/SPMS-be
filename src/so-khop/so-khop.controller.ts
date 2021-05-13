import { BadRequestException, Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';
import { AuthGuard } from '@nestjs/passport';
import { RowSoKhopNganhDaoTao } from './dto/row-so-khop.dto';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { UpdateSoKhopRequestBody } from './body/update-so-kho-request-body';
import { GetUser } from 'auth/user.decorator';
import { UsersEntity } from 'users/entity/user.entity';

@ApiTags('so-khop')
@Controller('so-khop')
export class SoKhopController {
  constructor(private readonly soKhopService: SoKhopService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.USER, Role.SINHVIEN, Role.GIAOVIEN, Role.QUANLY, Role.ADMIN])
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
  @Roles([Role.QUANLY, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Cập nhật so khớp môn học của 1 ngành đào tạo trong 2 năm' })
  @ApiOkResponse({ description: 'OK', type: [RowSoKhopNganhDaoTao] })
  @Put('/nganh-dao-tao/:id')
  async updateSoKhopMonHoc(
    @Param('id') id: number,
    @Body() body: UpdateSoKhopRequestBody,
    @GetUser() user: UsersEntity
  ) {
    const { khoaTuyenNam1, khoaTuyenNam2 } = body;
    if (Number(khoaTuyenNam1) >= Number(khoaTuyenNam2)) {
      throw new BadRequestException();
    }
    return await this.soKhopService.updateSoKhopMonHoc(id, body, user);
  }
}
