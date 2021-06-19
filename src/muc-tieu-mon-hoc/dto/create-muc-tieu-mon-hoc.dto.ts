import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export class CreateMucTieuMonHocDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  syllabus?: number;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{2,}$/, { message: 'Mã chỉ gồm chữ và số' })
  ma?: string;

  @ApiProperty()
  @IsNotEmpty()
  // @Length(5)
  moTa?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  chuanDauRaCDIO?: string[];
}
