import { Module } from '@nestjs/common';
import { KhoiKienThucService } from './khoi-kien-thuc.service';
import { KhoiKienThucController } from './khoi-kien-thuc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhoiKienThucEntity } from './entity/khoi-kien-thuc.entity';
import { ChiTietNganhDaoTaoModule } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.module';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KhoiKienThucEntity]),
    ChiTietNganhDaoTaoModule,
    RedisCacheModule,
    PermissionModule
  ],
  controllers: [KhoiKienThucController],
  providers: [KhoiKienThucService],
  exports: [KhoiKienThucService]
})
export class KhoiKIenThucModule {}
