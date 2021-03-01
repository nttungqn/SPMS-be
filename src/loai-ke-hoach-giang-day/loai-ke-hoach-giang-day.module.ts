import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaiKeHoachGiangDayEntity } from './entity/loaiKeHoachGiangDay.entity';
import { LoaiKeHoachGiangDayController } from './loai-ke-hoach-giang-day.controller';
import { LoaiKeHoachGiangDayService } from './loai-ke-hoach-giang-day.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoaiKeHoachGiangDayEntity])],
  controllers: [LoaiKeHoachGiangDayController],
  providers: [LoaiKeHoachGiangDayService]
})
export class LoaiKeHoachGiangDayModule {}
