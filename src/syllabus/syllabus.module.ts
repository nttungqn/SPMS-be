import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Syllabus } from './entity/syllabus.entity';
import { NamHocModule } from 'nam-hoc/nam-hoc.module';
import { HeDaotaoModule } from 'he-dao-tao/he-dao-tao.module';
import { MonHocModule } from 'mon-hoc/mon-hoc.module';

@Module({
  imports: [TypeOrmModule.forFeature([Syllabus]), NamHocModule, HeDaotaoModule, MonHocModule],
  controllers: [SyllabusController],
  providers: [SyllabusService]
})
export class SyllabusModule {}
