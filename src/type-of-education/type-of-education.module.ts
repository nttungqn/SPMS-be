import { Module } from '@nestjs/common';
import { TypeOfEducationService } from './type-of-education.service';
import { TypeOfEducationController } from './type-of-education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfEducation } from './entity/type-of-education.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TypeOfEducation])],
  controllers: [TypeOfEducationController],
  providers: [TypeOfEducationService]
})
export class TypeOfEducationModule {}
