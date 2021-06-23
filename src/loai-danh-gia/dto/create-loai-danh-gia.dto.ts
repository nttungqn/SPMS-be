import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

export class CreateLoaiDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Min(1)
  idSyllabus?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\.\#\_]{2,30}$/, { message: 'Mã : Gồm chữ và số có 2 - 30 ký tự, ký tự đặt biệt (#,.,_), ' })
  ma?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  // @Length(5)
  ten?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  tyLe?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  chuanDauRaMonHoc?: string[];
}
