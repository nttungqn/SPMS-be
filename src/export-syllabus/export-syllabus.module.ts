import { ChiTietKeHoachModule } from './../chi-tiet-ke-hoach/chi-tiet-ke-hoach.module';
import { KeHoachGiangDayModule } from './../ke-hoach-giang-day/ke-hoach-giang-day.module';
import { LoaiKhoiKienThucModule } from './../loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';
import { Module } from '@nestjs/common';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { ChuanDauRaNganhDaoTaoModule } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.module';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { ExportSyllabusController } from './export-syllabus.controller';
import { ExportSyllabusService } from './export-syllabus.service';
import { GomNhomModule } from 'gom-nhom/gom-nhom.module';
import { CloneModule } from 'clone/clone.module';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { MucTieuMonHocModule } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.module';
import { ChuanDauRaMonHocModule } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.module';
import { ChuDeModule } from 'chu-de/chu-de.module';
import { LoaiKeHoachGiangDayModule } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.module';
import { LoaiDanhGiaModule } from 'loai-danh-gia/loai-danh-gia.module';

@Module({
  imports: [
    ChiTietNganhDaoTaoModule,
    KhoiKIenThucModule,
    ChuanDauRaNganhDaoTaoModule,
    LoaiKhoiKienThucModule,
    GomNhomModule,
    KeHoachGiangDayModule,
    ChiTietKeHoachModule,
    CloneModule,
    SyllabusModule,
    MucTieuMonHocModule,
    ChuanDauRaMonHocModule,
    ChuDeModule,
    LoaiKeHoachGiangDayModule,
    LoaiDanhGiaModule
  ],
  controllers: [ExportSyllabusController],
  providers: [ExportSyllabusService]
})
export class ExportSyllabusModule {}
