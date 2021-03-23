import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { LoaiKeHoachGiangDayEntity } from 'loai-ke-hoach-giang-day/entity/loaiKeHoachGiangDay.entity';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateChuDeDto {
  @ApiProperty({ required: true })
  @IsInt()
  idSyllabus?: number;

  @ApiProperty({ required: true })
  @IsInt()
  idLKHGD?: number;

  @ApiProperty({ required: true })
  @IsString()
  ma?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ten?: string;

  @ApiProperty()
  @IsInt()
  tuan?: number;

  @ApiProperty()
  @IsString({ each: true })
  hoatDongDanhGia?: string[];

  @ApiProperty()
  @IsString({ each: true })
  chuanDauRaMonHoc?: string[];

  @ApiProperty()
  @IsString({ each: true })
  hoatDongDayHoc?: string[];
}
