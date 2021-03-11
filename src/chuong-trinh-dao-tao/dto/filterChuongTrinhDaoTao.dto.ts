import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

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
  @IsOptional()
  readonly search?: string;
  @IsOptional()
  @ApiProperty({ required: false })
  @IsOptional()
  readonly maCTDT?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  updatedAt: 'ASC' | 'DESC';
}
