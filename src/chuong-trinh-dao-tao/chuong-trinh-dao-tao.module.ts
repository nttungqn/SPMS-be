import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuongTrinhDaoTaoEntity]), RedisCacheModule, RolesModule],
  controllers: [ChuongTrinhDaoTaoController],
  providers: [ChuongTrinhDaoTaoService],
  exports: [ChuongTrinhDaoTaoService]
})
export class ChuongTrinhDaoTaoModule {}
