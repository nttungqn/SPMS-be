import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocController } from './mon-hoc.controller';
import { MonHocService } from './mon-hoc.service';
import { MonHocEntity } from './entity/monHoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocEntity])],
  controllers: [MonHocController],
  providers: [MonHocService]
})
export class MonHocModule {}
