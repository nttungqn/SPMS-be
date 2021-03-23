import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [ChiTietNganhDaoTaoModule]
})
export class SoKhopModule {}
