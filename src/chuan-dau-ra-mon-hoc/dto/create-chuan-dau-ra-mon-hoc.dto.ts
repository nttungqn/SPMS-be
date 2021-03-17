import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChuanDauRaMonHocDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  mucTieuMonHoc?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @IsString()
  @Optional()
  mota?: string;

  @ApiProperty()
  @IsString({ each: true })
  @Optional()
  mucDo?: string[];
}
