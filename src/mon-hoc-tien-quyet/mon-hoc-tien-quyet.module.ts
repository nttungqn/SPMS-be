import { Module } from '@nestjs/common';
import { MonHocTienQuyetService } from './mon-hoc-tien-quyet.service';
import { MonHocTienQuyetController } from './mon-hoc-tien-quyet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocTienQuyetEntity } from './entity/mon-hoc-tien-quyet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocTienQuyetEntity])],
  controllers: [MonHocTienQuyetController],
  providers: [MonHocTienQuyetService]
})
export class MonHocTienQuyetModule {}
