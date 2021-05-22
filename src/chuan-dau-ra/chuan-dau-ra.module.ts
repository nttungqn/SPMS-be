import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';
import { ChuanDauRaController } from './chuan-dau-ra.controller';
import { ChuanDauRaService } from './chuan-dau-ra.service';
import { ChuanDauRaEntity } from './entity/chuanDauRa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaEntity]), RedisCacheModule, PermissionModule],
  controllers: [ChuanDauRaController],
  providers: [ChuanDauRaService],
  exports: [ChuanDauRaService]
})
export class ChuanDauRaModule {}
