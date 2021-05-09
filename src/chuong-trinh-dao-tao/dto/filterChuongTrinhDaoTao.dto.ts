import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0, description: 'số trang muốn lấy' })
  @IsOptional()
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'số lượng dòng data muốn lấy' })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number;
}

export class FilterChuongTrinhDaoTao extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'mã chương trình đào tạo' })
  @IsOptional()
  readonly maCTDT?: string;

  @ApiProperty({
    required: false,
    description: 'Search by id, maCTDT, loaiHinh, trinhDo, dieuKienTotNghiep, ten, tongTinChi, doiTuong, quiTrinhDaoTao'
  })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description:
      'Sort by: id, maCTDT, loaiHinh, trinhDo, dieuKienTotNghiep, ten, tongTinChi, doiTuong, quiTrinhDaoTao, createdAt, updatedAt'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
