import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChiTietGomNhomDTO {
  @ApiProperty()
  @IsInt()
  idGN?: number;

  @ApiProperty()
  @IsInt()
  idMH?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ghiChu?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  idCTGNMonHocTruoc?: number;
}
