import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';
import { HoatDongDayHocService } from './hoat-dong-day-hoc.service';
import { HoatDongDayHocController } from './hoat-dong-day-hoc.controller';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([HoatDongDayHocEntity]), RedisCacheModule, RolesModule],
  providers: [HoatDongDayHocService],
  controllers: [HoatDongDayHocController],
  exports: [HoatDongDayHocService]
})
export class HoatDongDayHocModule {}
