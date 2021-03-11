import { GomNhomEntity } from './../gom-nhom/entity/gom-nhom.entity';
import { ChiTietGomNhomEntity } from './../chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { KhoiKienThucEntity } from './../khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { LoaiKhoiKienThucEntity } from './../loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiTietNganhDaoTaoController } from './chi-tiet-nganh-dao-tao.controller';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChiTietNganhDaoTaoEntity,
      ChuanDauRaNganhDaoTaoEntity,
      LoaiKhoiKienThucEntity,
      KhoiKienThucEntity,
      ChiTietGomNhomEntity,
      GomNhomEntity
    ])
  ],
  controllers: [ChiTietNganhDaoTaoController],
  providers: [ChiTietNganhDaoTaoService]
})
export class ChiTietNganhDaoTaoModule {}
