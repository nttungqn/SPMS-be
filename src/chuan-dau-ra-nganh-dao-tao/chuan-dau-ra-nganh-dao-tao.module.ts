import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuanDauRaNganhDaoTaoController } from './chuan-dau-ra-nganh-dao-tao.controller';
import { ChuanDauRaNganhDaoTaoService } from './chuan-dau-ra-nganh-dao-tao.service';
import { ChuanDauRaNganhDaoTaoEntity } from './entity/chuanDauRaNganhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaNganhDaoTaoEntity])],
  controllers: [ChuanDauRaNganhDaoTaoController],
  providers: [ChuanDauRaNganhDaoTaoService]
})
export class ChuanDauRaNganhDaoTaoModule {}
