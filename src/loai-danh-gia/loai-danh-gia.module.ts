import { Module } from '@nestjs/common';
import { LoaiDanhGiaService } from './loai-danh-gia.service';
import { LoaiDanhGiaController } from './loai-danh-gia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoaiDanhGiaEntity } from './entity/loai-danh-gia.entity';
import { SyllabusModule } from 'syllabus/syllabus.module';

@Module({
  imports: [TypeOrmModule.forFeature([LoaiDanhGiaEntity]), SyllabusModule],
  controllers: [LoaiDanhGiaController],
  providers: [LoaiDanhGiaService],
  exports: [LoaiDanhGiaService]
})
export class LoaiDanhGiaModule {}
