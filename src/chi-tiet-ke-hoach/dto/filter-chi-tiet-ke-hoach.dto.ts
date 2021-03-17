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

export class FilterChiTietKeHoach extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly idKHGD?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly idCTGN?: number;
}
