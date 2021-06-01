import { ChiTietKeHoachModule } from './../chi-tiet-ke-hoach/chi-tiet-ke-hoach.module';
import { KeHoachGiangDayModule } from './../ke-hoach-giang-day/ke-hoach-giang-day.module';
import { LoaiKhoiKienThucModule } from './../loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';
import { Module } from '@nestjs/common';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { ChuanDauRaNganhDaoTaoModule } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.module';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';
import { GomNhomModule } from 'gom-nhom/gom-nhom.module';
import { CloneModule } from 'clone/clone.module';

@Module({
  imports: [
    ChiTietNganhDaoTaoModule,
    KhoiKIenThucModule,
    ChuanDauRaNganhDaoTaoModule,
    LoaiKhoiKienThucModule,
    GomNhomModule,
    KeHoachGiangDayModule,
    ChiTietKeHoachModule,
    CloneModule
  ],
  controllers: [ExportsController],
  providers: [ExportsService]
})
export class ExportsModule {}
