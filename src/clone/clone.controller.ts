import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @Get('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/loai-khoi-kien-thuc-detail')
  async getLoaiKhoiKienThuc(@Param('idCTNDTClone') idCTNDTClone: number, @Param('idCTNDT') idCTNDT: number) {
    return await this.cloneService.LoaiKhoiKienThucDetailClone(idCTNDTClone, idCTNDT);
  }

  @Put('/chi-tiet-nganh-dao-tao/:idCTNDT/:idCTNDTClone/loai-khoi-kien-thuc-detail')
  async updateLoaiKhoiKienThuc(
    @Body() loaiKhoiKienThucList: LoaiKhoiKienThucEntity[],
    @Param('idCTNDTClone') idCTNDTClone: number,
    @Param('idCTNDT') idCTNDT: number
  ) {
    return await this.cloneService.updateLoaiKhoiKienThucDetailClone(loaiKhoiKienThucList, idCTNDTClone, idCTNDT);
  }
}
