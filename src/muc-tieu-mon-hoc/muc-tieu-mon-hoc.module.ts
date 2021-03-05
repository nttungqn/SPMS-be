import { Module } from '@nestjs/common';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';
import { MucTieuMonHocController } from './muc-tieu-mon-hoc.controller';
import { SyllabusModule } from 'syllabus/syllabus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MucTieuMonHocEntity } from './entity/muc-tieu-mon-hoc.entity';

@Module({
  controllers: [MucTieuMonHocController],
  providers: [MucTieuMonHocService],
  imports: [SyllabusModule, TypeOrmModule.forFeature([MucTieuMonHocEntity])]
})
export class MucTieuMonHocModule {}
