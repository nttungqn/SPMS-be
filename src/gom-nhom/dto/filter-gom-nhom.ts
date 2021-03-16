import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  readonly page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly limit?: number;
}

export class FilterGomNhom extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Tieu De ' })
  @IsOptional()
  readonly search?: string;
}
