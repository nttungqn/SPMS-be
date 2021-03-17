import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonHocController } from './mon-hoc.controller';
import { MonHocService } from './mon-hoc.service';
import { MonHocEntity } from './entity/mon-hoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonHocEntity])],
  controllers: [MonHocController],
  providers: [MonHocService],
  exports: [MonHocService]
})
export class MonHocModule {}
