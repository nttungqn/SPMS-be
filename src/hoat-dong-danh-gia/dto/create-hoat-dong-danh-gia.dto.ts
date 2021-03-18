import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHoatDongDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  idLoaiDanhGia?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  ma?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ten?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  moTa?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tyLe?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  chuanDauRaMonHoc?: string[];
}
