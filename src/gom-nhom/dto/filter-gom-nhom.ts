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

export class FilterGomNhom extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Tieu De ' })
  @IsOptional()
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idLKKT: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly maGN: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly loaiNhom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly soTCBB: number;
}
