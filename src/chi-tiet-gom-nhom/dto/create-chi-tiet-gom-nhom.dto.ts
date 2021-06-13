import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateChiTietGomNhomDTO {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  idGN?: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
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
