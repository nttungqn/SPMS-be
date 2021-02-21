import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Syllabus } from './entity/syllabus.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Syllabus])],
  controllers: [SyllabusController],
  providers: [SyllabusService]
})
export class SyllabusModule {}
