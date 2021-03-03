import { Module } from '@nestjs/common';
import { NamHocService } from './nam-hoc.service';
import { NamHocController } from './nam-hoc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NamHocEntity } from './entity/nam-hoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NamHocEntity])],
  controllers: [NamHocController],
  providers: [NamHocService],
  exports: [NamHocService]
})
export class NamHocModule {}
