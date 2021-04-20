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

export class FilterChiTietKeHoach extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly idKHGD?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly idCTGN?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  readonly ghiChu?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly search?: string;

  @ApiProperty({
    required: false,
    description: 'Sort by column: id, idKHGD.maKeHoach, idCTGN.id, ghiChu, updatedAt, createdAt'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'Sort by type: ASC, DESC' })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  readonly sortType?: 'ASC' | 'DESC';
}
