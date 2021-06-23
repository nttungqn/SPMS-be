import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export class CreateChuDeDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  idSyllabus?: number;

  @ApiProperty({ required: true })
  @IsInt()
  @Min(1)
  idLKHGD?: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\.\#\_]{2,30}$/, { message: 'Mã : Gồm chữ và số có 2 - 30 ký tự, ký tự đặt biệt (#,.,_), ' })
  ma?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ten?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  tuan?: number;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  hoatDongDanhGia?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  chuanDauRaMonHoc?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  hoatDongDayHoc?: string[];
}
