import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { CloneService } from './clone.service';

@ApiTags('clone')
@Controller('clone')
export class CloneController {
  constructor(private readonly cloneService: CloneService) {}

  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc')
  async getKhoiKienThuc(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.khoiKienThucClone(idCTNDTClone, idCTNDT);
  }

  @Put('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc')
  updateKhoiKienThuc(
    @Body() khoikienThucList: KhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number
  ) {
    return this.cloneService.updateKhoiKienThuc(khoikienThucList, idCTNDT);
  }

  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/loai-khoi-kien-thuc-chi-tiet')
  async getLoaiKhoiKienThuc(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.LoaiKhoiKienThucDetailClone(idCTNDTClone, idCTNDT);
  }

  @Put('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/loai-khoi-kien-thuc-chi-tiet')
  async updateLoaiKhoiKienThuc(
    @Body() loaiKhoiKienThucList: LoaiKhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number
  ) {
    return await this.cloneService.updateLoaiKhoiKienThucDetailClone(loaiKhoiKienThucList, idCTNDTClone, idCTNDT);
  }
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
    @Param('idCTNDT') idCTNDT: number
  ) {
    return await this.cloneService.createKeHoachGiangDayClone(keHoachGiangDayEntity, idCTNDTClone, idCTNDT);
  }

  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  async getKhoiKienThucDetail(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.khoiKienThucDetailClone(idCTNDTClone, idCTNDT);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('token')
  @Post('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/khoi-kien-thuc-chi-tiet')
  async createKhoiKienThucDetail(
    @Body() khoiKienThucList: KhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number
  ) {
    return await this.cloneService.createKhoiKienThucDetailClone(khoiKienThucList, idCTNDTClone, idCTNDT);
  }

  @Delete('/chi-tiet-nganh-dao-tao/:idKKT')
  async khoiKienThuc(@Param('idKKT') idKKT: number) {
    return await this.cloneService.deleteKhoiKienThuc(idKKT);
  }
}
