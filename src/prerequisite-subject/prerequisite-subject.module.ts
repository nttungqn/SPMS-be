import { Module } from '@nestjs/common';
import { PrerequisiteSubjectService } from './prerequisite-subject.service';
import { PrerequisiteSubjectController } from './prerequisite-subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrerequisiteSubject } from './entity/prerequisite-subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrerequisiteSubject])],
  controllers: [PrerequisiteSubjectController],
  providers: [PrerequisiteSubjectService]
})
export class PrerequisiteSubjectModule {}
