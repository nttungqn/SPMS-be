import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateLoaiDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  idSyllabus?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  ma?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  ten?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  tyLe?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  chuanDauRaMonHoc?: string[];
}
