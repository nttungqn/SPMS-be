import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuongTrinhDaoTaoEntity])],
  controllers: [ChuongTrinhDaoTaoController],
  providers: [ChuongTrinhDaoTaoService]
})
export class ChuongTrinhDaoTaoModule {}
