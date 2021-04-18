import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

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
