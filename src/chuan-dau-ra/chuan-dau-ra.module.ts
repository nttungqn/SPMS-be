import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';
import { ChuanDauRaController } from './chuan-dau-ra.controller';
import { ChuanDauRaService } from './chuan-dau-ra.service';
import { ChuanDauRaEntity } from './entity/chuanDauRa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuanDauRaEntity]), RedisCacheModule, RolesModule],
  controllers: [ChuanDauRaController],
  providers: [ChuanDauRaService],
  exports: [ChuanDauRaService]
})
export class ChuanDauRaModule {}
