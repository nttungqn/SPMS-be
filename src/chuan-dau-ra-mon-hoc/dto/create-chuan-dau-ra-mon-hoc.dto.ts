import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class CreateChuanDauRaMonHocDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mucTieuMonHoc?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\.\#\_]{2,30}$/, { message: 'Mã : Gồm chữ và số có 2 - 30 ký tự, ký tự đặt biệt (#,.,_), ' })
  ma?: string;

  @ApiProperty()
  @IsNotEmpty()
  mota?: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  mucDo?: string[];
}
