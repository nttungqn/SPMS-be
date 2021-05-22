import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocController } from './mon-hoc.controller';
import { MonHocService } from './mon-hoc.service';
import { MonHocEntity } from './entity/mon-hoc.entity';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocEntity]), RedisCacheModule, PermissionModule],
  controllers: [MonHocController],
  providers: [MonHocService],
  exports: [MonHocService]
})
export class MonHocModule {}
