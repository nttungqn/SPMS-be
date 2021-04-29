import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class FilterLoaiDanhGia extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idSyllabus: number;

  @ApiProperty({ required: false, description: ' this field search by Ten , ma ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort a string in column: syllabus, ten, ma, tyLe, updatedAt, createdAt, updatedBy, createdBy'
  })
  @IsOptional()
  @IsIn(['syllabus', 'ten', 'ma', 'tyLe', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy'])
  sortBy: 'syllabus' | 'ma' | 'ten' | 'tyLe' | 'updatedAt' | 'createdAt' | 'updatedBy' | 'createdBy';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
