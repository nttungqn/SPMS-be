import { Module } from '@nestjs/common';
import { LoaiKhoiKienThucService } from './loai-khoi-kien-thuc.service';
import { LoaiKhoiKienThucController } from './loai-khoi-kien-thuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaiKhoiKienThucEntity } from './entity/type-of-knowledge-block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoaiKhoiKienThucEntity])],
  controllers: [LoaiKhoiKienThucController],
  providers: [LoaiKhoiKienThucService]
})
export class LoaiKhoiKienThucModule {}
