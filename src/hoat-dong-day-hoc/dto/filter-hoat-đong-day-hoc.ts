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

export class FilterHoatDongDayHoc extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Ten ' })
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idCD: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly ma: string;
}
