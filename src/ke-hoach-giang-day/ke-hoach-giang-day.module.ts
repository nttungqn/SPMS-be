import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { RolesModule } from 'roles/roles.module';
import { KeHoachGiangDayEntity } from './entity/keHoachGiangDay.entity';
import { KeHoachGiangDayController } from './ke-hoach-giang-day.controller';
import { KeHoachGiangDayService } from './ke-hoach-giang-day.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeHoachGiangDayEntity]), ChiTietNganhDaoTaoModule, RedisCacheModule, RolesModule],
  controllers: [KeHoachGiangDayController],
  providers: [KeHoachGiangDayService],
  exports: [KeHoachGiangDayService]
})
export class KeHoachGiangDayModule {}
