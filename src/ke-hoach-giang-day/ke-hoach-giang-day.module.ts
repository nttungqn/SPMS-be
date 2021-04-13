import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { KeHoachGiangDayEntity } from './entity/keHoachGiangDay.entity';
import { KeHoachGiangDayController } from './ke-hoach-giang-day.controller';
import { KeHoachGiangDayService } from './ke-hoach-giang-day.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeHoachGiangDayEntity]), ChiTietNganhDaoTaoModule],
  controllers: [KeHoachGiangDayController],
  providers: [KeHoachGiangDayService],
  exports: [KeHoachGiangDayService]
})
export class KeHoachGiangDayModule {}
