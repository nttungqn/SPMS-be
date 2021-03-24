import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { MonHocModule } from 'mon-hoc/mon-hoc.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [KhoiKIenThucModule, MonHocModule]
})
export class SoKhopModule {}
