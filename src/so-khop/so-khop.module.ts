import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';
import { MonHocModule } from 'mon-hoc/mon-hoc.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [ChiTietGomNhomModule, MonHocModule]
})
export class SoKhopModule {}
