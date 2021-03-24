import { Module } from '@nestjs/common';
import { KhoiKienThucService } from './khoi-kien-thuc.service';
import { KhoiKienThucController } from './khoi-kien-thuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhoiKienThucEntity } from './entity/khoi-kien-thuc.entity';
import { LoaiKhoiKienThucModule } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';

@Module({
  imports: [TypeOrmModule.forFeature([KhoiKienThucEntity]), LoaiKhoiKienThucModule],
  controllers: [KhoiKienThucController],
  providers: [KhoiKienThucService],
  exports: [KhoiKienThucService]
})
export class KhoiKIenThucModule {}
