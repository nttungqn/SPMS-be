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

export class FilterChuongTrinhDaoTao extends BaseFilterDto {
  @IsOptional()
  @ApiProperty({ required: false, description: ' this field search by Ten' })
  readonly search?: string;
  @IsOptional()
  @ApiProperty({ required: false })
  readonly maCTDT?: string;
}
