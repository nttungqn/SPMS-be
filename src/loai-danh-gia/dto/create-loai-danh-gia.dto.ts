import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateLoaiDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Min(1)
  idSyllabus?: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Length(3)
  ma?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Length(5)
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
