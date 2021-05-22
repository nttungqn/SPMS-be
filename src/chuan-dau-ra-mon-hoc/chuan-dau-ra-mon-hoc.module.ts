import { Module } from '@nestjs/common';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';
import { ChuanDauRaMonHocController } from './chuan-dau-ra-mon-hoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChuanDauRaMonHocEntity } from './entity/chuan-dau-ra-mon-hoc.entity';
import { MucTieuMonHocModule } from 'muc-tieu-mon-hoc/muc-tieu-mon-hoc.module';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { RedisCacheModule } from 'cache/redisCache.module';
import { PermissionModule } from 'permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChuanDauRaMonHocEntity]),
    MucTieuMonHocModule,
    SyllabusModule,
    RedisCacheModule,
    PermissionModule
  ],
  controllers: [ChuanDauRaMonHocController],
  providers: [ChuanDauRaMonHocService],
  exports: [ChuanDauRaMonHocService]
})
export class ChuanDauRaMonHocModule {}
