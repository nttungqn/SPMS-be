import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number;
}

export class FilterChiTietGomNhom extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idGN?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idMH?: number;
}
