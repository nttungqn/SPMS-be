import { Module } from '@nestjs/common';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';
import { MucTieuMonHocController } from './muc-tieu-mon-hoc.controller';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';
import { ChuanDauRaNganhDaoTaoModule } from 'chuan-dau-ra-nganh-dao-tao/chuan-dau-ra-nganh-dao-tao.module';
import { RedisCacheModule } from 'cache/redisCache.module';

@Module({
  controllers: [MucTieuMonHocController],
  providers: [MucTieuMonHocService],
  imports: [
    SyllabusModule,
    ChuanDauRaNganhDaoTaoModule,
    TypeOrmModule.forFeature([MucTieuMonHocEntity]),
    RedisCacheModule
  ],
  exports: [MucTieuMonHocService]
})
export class MucTieuMonHocModule {}
