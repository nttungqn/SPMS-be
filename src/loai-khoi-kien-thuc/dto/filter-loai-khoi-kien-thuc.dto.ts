import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterLoaiKhoiKienThuc extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly idKhoiKienThuc?: number;

  @ApiProperty({ required: false, description: 'Search by id, maLoaiKhoiKienThuc, ten, tongTinChi, noiDung' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort by: id, maLoaiKhoiKienThuc, ten, tongTinChi, noiDung, createdAt, updatedAt'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
