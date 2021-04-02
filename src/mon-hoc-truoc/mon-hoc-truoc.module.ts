import { Module } from '@nestjs/common';
import { MonHocTruocService } from './mon-hoc-truoc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocTruocEntity } from './entity/mon-hoc-truoc.entity';
import { ChiTietGomNhomModule } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.module';
import { MonHocTruocController } from './mon-hoc-truoc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocTruocEntity]), ChiTietGomNhomModule],
  providers: [MonHocTruocService],
  exports: [MonHocTruocService],
  controllers: [MonHocTruocController]
})
export class MonHocTruocModule {}
