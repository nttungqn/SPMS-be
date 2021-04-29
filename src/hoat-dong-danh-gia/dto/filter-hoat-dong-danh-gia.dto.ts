import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class FilterHoatDongDanhGia extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idLoaiDanhGia: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idSyllabus: number;

  @ApiProperty({ required: false, description: ' this field search by Ten ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort a string in column: loaiDanhGia, ten, ma, moTa, tyLe, updatedAt, createdAt, updatedBy, createdBy'
  })
  @IsOptional()
  @IsIn(['loaiDanhGia', 'ten', 'ma', 'moTa', 'tyLe', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy'])
  sortBy: 'loaiDanhGia' | 'ma' | 'ten' | 'moTa' | 'tyLe' | 'updatedAt' | 'createdAt' | 'updatedBy' | 'createdBy';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
