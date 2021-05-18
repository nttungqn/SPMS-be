import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { RolesModule } from 'roles/roles.module';
import { CtdtController } from './ctdt.controller';
import { CtdtService } from './ctdt.service';
import { NganhDaoTaoEntity } from './entity/nganhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NganhDaoTaoEntity]), RedisCacheModule, RolesModule],
  controllers: [CtdtController],
  providers: [CtdtService],
  exports: [CtdtService]
})
export class CtdtModule {}
