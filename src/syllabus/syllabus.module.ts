import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Syllabus } from './entity/syllabus.entity';
import { SchoolYearModule } from 'school-year/school-year.module';
import { TypeOfEducationModule } from 'type-of-education/type-of-education.module';
import { MonHocModule } from 'mon-hoc/mon-hoc.module';

@Module({
  imports: [TypeOrmModule.forFeature([Syllabus]), SchoolYearModule, TypeOfEducationModule, MonHocModule],
  controllers: [SyllabusController],
  providers: [SyllabusService]
})
export class SyllabusModule {}
