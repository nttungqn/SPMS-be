import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';
import { LoaiKeHoachGiangDayController } from './loai-ke-hoach-giang-day.controller';
import { LoaiKeHoachGiangDayService } from './loai-ke-hoach-giang-day.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoaiKeHoachGiangDayEntity]), RedisCacheModule, RolesModule],
  controllers: [LoaiKeHoachGiangDayController],
  providers: [LoaiKeHoachGiangDayService],
  exports: [LoaiKeHoachGiangDayService]
})
export class LoaiKeHoachGiangDayModule {}
