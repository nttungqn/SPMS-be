import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';

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
  @Length(2)
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
