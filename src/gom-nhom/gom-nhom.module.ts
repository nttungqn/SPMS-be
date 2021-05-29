import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GomNhomService } from './gom-nhom.service';
import { GomNhomController } from './gom-nhom.controller';
import { GomNhomEntity } from './entity/gom-nhom.entity';
import { LoaiKhoiKienThucModule } from 'loai-khoi-kien-thuc/loai-khoi-kien-thuc.module';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([GomNhomEntity]), LoaiKhoiKienThucModule, RedisCacheModule, PermissionModule],
  providers: [GomNhomService],
  controllers: [GomNhomController],
  exports: [GomNhomService]
})
export class GomNhomModule {}
