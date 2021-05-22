import { Module } from '@nestjs/common';
import { NamHocService } from './nam-hoc.service';
import { NamHocController } from './nam-hoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamHocEntity } from './entity/nam-hoc.entity';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([NamHocEntity]), RedisCacheModule, PermissionModule],
  controllers: [NamHocController],
  providers: [NamHocService],
  exports: [NamHocService]
})
export class NamHocModule {}
