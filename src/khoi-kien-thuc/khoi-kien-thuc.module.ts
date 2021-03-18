import { Module } from '@nestjs/common';
import { KhoiKienThucService } from './khoi-kien-thuc.service';
import { KhoiKienThucController } from './khoi-kien-thuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhoiKienThucEntity } from './entity/khoi-kien-thuc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KhoiKienThucEntity])],
  controllers: [KhoiKienThucController],
  providers: [KhoiKienThucService],
  exports: [KhoiKienThucService]
})
export class KhoiKIenThucModule {}
