import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateChiTietGomNhomDTO {
  @ApiProperty()
  @IsInt()
  idGN?: number;

  @ApiProperty()
  @IsNumberString()
  idMH?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ghiChu?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  idChiTietGomNhom?: number;
}
