import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoaiKhoiKienThucModule } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';
import { RedisCacheModule } from 'cache/redisCache.module';
import { GenerateSyllabusService } from './generate-syllabus.service';
import { GenerateSyllabusController } from './generate-syllabus.controller';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { MucTieuMonHocModule } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.module';
import { ChuanDauRaMonHocModule } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.module';
import { LoaiDanhGiaModule } from 'loai-danh-gia/loai-danh-gia.module';
import { HoatDongDayHocModule } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.module';
import { ChuDeModule } from 'chu-de/chu-de.module';
import { HoatDongDanhGiaModule } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [
    SyllabusModule,
    MucTieuMonHocModule,
    ChuanDauRaMonHocModule,
    LoaiDanhGiaModule,
    HoatDongDayHocModule,
    ChuDeModule,
    HoatDongDanhGiaModule,
    HoatDongDayHocModule,
    PermissionModule
  ],
  providers: [GenerateSyllabusService],
  controllers: [GenerateSyllabusController],
  exports: [GenerateSyllabusService]
})
export class GenerateSyllabusModule {}
