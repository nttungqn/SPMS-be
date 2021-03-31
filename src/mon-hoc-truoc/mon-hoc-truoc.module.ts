import { Module } from '@nestjs/common';
import { MonHocTruocService } from './mon-hoc-truoc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocTruocEntity } from './entity/mon-hoc-truoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocTruocEntity])],
  providers: [MonHocTruocService],
  exports: [MonHocTruocService]
})
export class MonHocTruocModule {}
