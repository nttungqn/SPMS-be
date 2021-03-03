import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoatDongDayHocEntity } from './entity/hoat-dong-day-hoc.entity';
import { HoatDongDayHocService } from './hoat-dong-day-hoc.service';
import { HoatDongDayHocController } from './hoat-dong-day-hoc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HoatDongDayHocEntity])],
  providers: [HoatDongDayHocService],
  controllers: [HoatDongDayHocController],
  exports: [HoatDongDayHocService]
})
export class HoatDongDayHocModule {}
