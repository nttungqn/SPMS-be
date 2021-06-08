import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'auth/user.decorator';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { CLONE_MESSAGE } from 'constant/constant';
import { RolesGuard } from 'guards/roles.guard';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateCTDTBody } from './body/create-ctdt-body.dto';
import { CloneService } from './clone.service';

@ApiTags('clone')
@Controller('clone')
export class CloneController {
  constructor(private readonly cloneService: CloneService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone')
  async getChiTietNganhDaoTao(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.ChiTietNganhDaoTaoClone(idCTNDTClone, idCTNDT);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT')
  @HttpCode(HttpStatus.CREATED)
  async createChiTietNganhDaoTao(
    @Body() data: CreateCTDTBody,
    @Param('idCTNDT') idCTNDT: number,
    @GetUser() user: UsersEntity
  ) {
    await this.cloneService.CreateChiTietNganhDaoTao(
      data.chuanDauRa,
      data.khoiKienThuc,
      data.keHoachGiangDay,
      idCTNDT,
      user
    );
    return { message: CLONE_MESSAGE.CREATE_CHUONG_TRINH_DAO_TAO_SUCCESSFULLY };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/ke-hoach-giang-day')
  async getKeHoachGiangDay(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.KeHoachGiangDayClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/ke-hoach-giang-day')
  async createKeHoachGiangDayClone(
    @Body() keHoachGiangDayEntity: KeHoachGiangDayEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number,
    @GetUser() user: UsersEntity
  ) {
    await this.cloneService.createKeHoachGiangDayClone(keHoachGiangDayEntity, idCTNDTClone, idCTNDT, user.id);
    return { message: CLONE_MESSAGE.CREATE_KE_HOACH_GIANG_DAY_SUCCESSFULLY };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  async getKhoiKienThucDetail(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.khoiKienThucDetailClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  @HttpCode(HttpStatus.CREATED)
  async createKhoiKienThucDetail(
    @Body() khoiKienThucList: KhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number,
    @GetUser() user: UsersEntity
  ) {
    await this.cloneService.createKhoiKienThucDetailClone(khoiKienThucList, idCTNDTClone, idCTNDT, user.id);
    return { message: CLONE_MESSAGE.CREATE_NOI_DUNG_SUCCESSFULLY };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/chuan-dau-ra-nganh-dao-tao')
  async getChuanDauRaNganhDaoTaoDetail(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.chuanDauRaNganhDaoTaoClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/chuan-dau-ra-nganh-dao-tao')
  async createChuanDauRaNganhDaoTaoDetail(
    @Body() chuanDauRaList: ChuanDauRaNganhDaoTaoEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number,
    @GetUser() user: UsersEntity
  ) {
    await this.cloneService.createChuanDauRaNganhDaoTaoClone(chuanDauRaList, idCTNDTClone, idCTNDT, user);
    return { message: CLONE_MESSAGE.CREATE_CHUAN_DAU_RA_SUCCESSFULLY };
  }
}
