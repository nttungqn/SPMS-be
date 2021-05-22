import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { ChuanDauRaMonHocModule } from 'chuan-dau-ra-mon-hoc/chuan-dau-ra-mon-hoc.module';
import { HoatDongDanhGiaModule } from 'hoat-dong-danh-gia/hoat-dong-danh-gia.module';
import { HoatDongDayHocModule } from 'hoat-dong-day-hoc/hoat-dong-day-hoc.module';
import { LoaiKeHoachGiangDayModule } from 'loai-ke-hoach-giang-day/loai-ke-hoach-giang-day.module';
import { PermissionModule } from 'permission/permission.module';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { ChuDeController } from './chu-de.controller';
import { ChuDeService } from './chu-de.service';
import { ChuDeEntity } from './entity/chu-de.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChuDeEntity]),
    SyllabusModule,
    LoaiKeHoachGiangDayModule,
    HoatDongDanhGiaModule,
    ChuanDauRaMonHocModule,
    HoatDongDayHocModule,
    RedisCacheModule,
    PermissionModule
  ],
  controllers: [ChuDeController],
  providers: [ChuDeService],
  exports: [ChuDeService]
})
export class ChuDeModule {}
