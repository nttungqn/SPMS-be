import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'auth/user.decorator';
import { CLONE_MESSAGE } from 'constant/constant';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { UsersEntity } from 'users/entity/user.entity';
import { CloneService } from './clone.service';

@ApiTags('clone')
@Controller('clone')
export class CloneController {
  constructor(private readonly cloneService: CloneService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/ke-hoach-giang-day')
  async getKeHoachGiangDay(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.KeHoachGiangDayClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'))
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

  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  async getKhoiKienThucDetail(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.khoiKienThucDetailClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  @HttpCode(HttpStatus.CREATED)
  async createKhoiKienThucDetail(
    @Body(ValidationPipe) khoiKienThucList: KhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number,
    @GetUser() user: UsersEntity
  ) {
    await this.cloneService.createKhoiKienThucDetailClone(khoiKienThucList, idCTNDTClone, idCTNDT, user.id);
    return { message: CLONE_MESSAGE.CREATE_NOI_DUNG_SUCCESSFULLY };
  }

  @Delete('/chi-tiet-nganh-dao-tao/:idKKT')
  async khoiKienThuc(@Param('idKKT') idKKT: number) {
    return await this.cloneService.deleteKhoiKienThuc(idKKT);
  }
}
