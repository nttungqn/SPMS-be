import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsOptional, IsNumberString, IsIn } from 'class-validator';

export class FilterCTNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'khóa tuyển của ngành đào tạo' })
  @IsNumberString()
  @IsOptional()
  khoa: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'id của ngành đào tạo' })
  nganhDaoTao: number;

  @ApiProperty({ required: false, description: 'Search by id, khoa, coHoiNgheNghiep, mucTieuChung' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort by: id, khoa, coHoiNgheNghiep, mucTieuChung, createdAt, updatedAt'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
