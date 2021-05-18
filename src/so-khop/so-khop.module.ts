import { Module } from '@nestjs/common';
import { SoKhopService } from './so-khop.service';
import { SoKhopController } from './so-khop.controller';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';
import { MonHocModule } from 'mon-hoc/mon-hoc.module';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';

@Module({
  controllers: [SoKhopController],
  providers: [SoKhopService],
  imports: [ChiTietGomNhomModule, MonHocModule, RedisCacheModule, RolesModule]
})
export class SoKhopModule {}
