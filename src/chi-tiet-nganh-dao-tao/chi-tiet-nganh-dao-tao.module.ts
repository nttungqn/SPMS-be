import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiTietNganhDaoTaoController } from './chi-tiet-nganh-dao-tao.controller';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChiTietNganhDaoTaoEntity])],
  controllers: [ChiTietNganhDaoTaoController],
  providers: [ChiTietNganhDaoTaoService],
  exports: [ChiTietNganhDaoTaoService]
})
export class ChiTietNganhDaoTaoModule {}
