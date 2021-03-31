import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { MonHocTruocModule } from 'mon-hoc-truoc/mon-hoc-truoc.module';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [KhoiKIenThucModule, MonHocTruocModule, ChiTietNganhDaoTaoModule]
})
export class SoKhopModule {}
