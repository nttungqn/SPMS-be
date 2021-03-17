import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateMucTieuMonHocDto {
  @ApiProperty()
  @IsNotEmpty()
  syllabus?: number;

  @ApiProperty()
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @IsOptional()
  moTa?: string;

  @ApiProperty()
  @IsOptional()
  chuanDauRaCDIO?: string[];
}
