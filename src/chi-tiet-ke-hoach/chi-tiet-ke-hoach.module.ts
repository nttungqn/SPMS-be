import { Module } from '@nestjs/common';
import { ChiTietKeHoachService } from './chi-tiet-ke-hoach.service';
import { ChiTietKeHoachController } from './chi-tiet-ke-hoach.controller';
import { ChiTietKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { KeHoachGiangDayModule } from 'ke-hoach-giang-day/ke-hoach-giang-day.module';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [
    RedisCacheModule,
    KeHoachGiangDayModule,
    ChiTietGomNhomModule,
    TypeOrmModule.forFeature([ChiTietKeHoachEntity]),
    PermissionModule
  ],
  providers: [ChiTietKeHoachService],
  controllers: [ChiTietKeHoachController],
  exports: [ChiTietKeHoachService]
})
export class ChiTietKeHoachModule {}
