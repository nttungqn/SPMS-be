import { Module } from '@nestjs/common';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { ChuanDauRaNganhDaoTaoModule } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.module';
import { KhoiKIenThucModule } from 'khoi-kien-thuc/khoi-kien-thuc.module';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';

@Module({
  imports: [ChiTietNganhDaoTaoModule, KhoiKIenThucModule, ChuanDauRaNganhDaoTaoModule],
  controllers: [ExportsController],
  providers: [ExportsService]
})
export class ExportsModule {}
