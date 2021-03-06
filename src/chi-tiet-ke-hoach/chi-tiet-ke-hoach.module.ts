import { Module } from '@nestjs/common';
import { ChiTietKeHoachService } from './chi-tiet-ke-hoach.service';
import { ChiTietKeHoachController } from './chi-tiet-ke-hoach.controller';
import { ChiTIetKeHoachEntity } from './entity/chi-tiet-ke-hoach.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTIetKeHoachEntity])],
  providers: [ChiTietKeHoachService],
  controllers: [ChiTietKeHoachController]
})
export class ChiTietKeHoachModule {}
