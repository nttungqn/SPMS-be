import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
