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

export class FilterMonHoc extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Ten Tieng Viet' })
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly soTietLyThuyet: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly soTietThucHanh: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly soTietTuHoc: number;
}
