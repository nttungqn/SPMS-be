import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [KhoiKIenThucModule, ChiTietNganhDaoTaoModule, ChiTietGomNhomModule]
})
export class SoKhopModule {}
