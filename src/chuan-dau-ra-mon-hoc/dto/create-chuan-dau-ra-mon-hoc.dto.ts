import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateChuanDauRaMonHocDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  mucTieuMonHoc?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @IsNotEmpty()
  mota?: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty()
  mucDo?: string[];
}
