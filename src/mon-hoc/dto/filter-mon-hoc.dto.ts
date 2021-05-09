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

export class FilterMonHoc extends BaseFilterDto {
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

  @ApiProperty({
    required: false,
    description: 'Search by id, ma, tenTiengViet, tenTiengAnh, soTietLyThuyet, soTietThucHanh, soTietTuHoc'
  })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description:
      'Sort by: id, ma, tenTiengViet, tenTiengAnh, soTietLyThuyet, soTietThucHanh, soTietTuHoc, createdAt, updatedAt'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
