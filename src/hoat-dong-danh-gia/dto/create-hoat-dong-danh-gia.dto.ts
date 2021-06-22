import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

export class CreateHoatDongDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  idLoaiDanhGia?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(3)
  @Matches(/^[a-zA-Z0-9\.\#\_]{3,30}$/, { message: 'Mã : Gồm chữ và số có 3 - 30 ký tự, ' })
  ma?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(3)
  ten?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // // @Length(5)
  moTa?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  tyLe?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  chuanDauRaMonHoc?: string[];
}
