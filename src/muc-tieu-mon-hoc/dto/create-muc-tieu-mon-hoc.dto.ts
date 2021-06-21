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
  @Matches(/^[a-zA-Z0-9_|]{1,}$/, { message: 'Mã CTDT: Gồm chữ và số có >= 1 ký tự' })  ma?: string;

  @ApiProperty()
  @IsNotEmpty()
  // @Length(5)
  moTa?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  chuanDauRaCDIO?: string[];
}
