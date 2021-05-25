import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';
import { ChiTietNganhDaoTaoController } from './chi-tiet-nganh-dao-tao.controller';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';
import { ChiTietNganhDaoTaoEntity } from './entity/chiTietNganhDaoTao.entity';

@Module({
  imports: [RedisCacheModule, TypeOrmModule.forFeature([ChiTietNganhDaoTaoEntity]), PermissionModule],
  controllers: [ChiTietNganhDaoTaoController],
  providers: [ChiTietNganhDaoTaoService],
  exports: [ChiTietNganhDaoTaoService]
})
export class ChiTietNganhDaoTaoModule {}
