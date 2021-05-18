import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';
import { ChuanDauRaNganhDaoTaoController } from './chuan-dau-ra-nganh-dao-tao.controller';
import { ChuanDauRaNganhDaoTaoService } from './chuan-dau-ra-nganh-dao-tao.service';
import { ChuanDauRaNganhDaoTaoEntity } from './entity/chuanDauRaNganhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaNganhDaoTaoEntity]), RedisCacheModule, RolesModule],
  controllers: [ChuanDauRaNganhDaoTaoController],
  providers: [ChuanDauRaNganhDaoTaoService],
  exports: [ChuanDauRaNganhDaoTaoService]
})
export class ChuanDauRaNganhDaoTaoModule {}
