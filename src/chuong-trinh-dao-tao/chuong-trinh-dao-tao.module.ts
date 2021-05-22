import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';
import { ChuongTrinhDaoTaoService } from './chuong-trinh-dao-tao.service';
import { ChuongTrinhDaoTaoEntity } from './entity/chuongTrinhDaoTao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChuongTrinhDaoTaoEntity]), RedisCacheModule, PermissionModule],
  controllers: [ChuongTrinhDaoTaoController],
  providers: [ChuongTrinhDaoTaoService],
  exports: [ChuongTrinhDaoTaoService]
})
export class ChuongTrinhDaoTaoModule {}
