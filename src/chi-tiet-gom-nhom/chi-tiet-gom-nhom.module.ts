import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiTietGomNhomEntity } from './entity/chi-tiet-gom-nhom.entity';
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';
import { ChiTietGomNhomController } from './chi-tiet-gom-nhom.controller';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [RedisCacheModule, TypeOrmModule.forFeature([ChiTietGomNhomEntity]), PermissionModule],
  providers: [ChiTietGomNhomService],
  controllers: [ChiTietGomNhomController],
  exports: [ChiTietGomNhomService]
})
export class ChiTietGomNhomModule {}
