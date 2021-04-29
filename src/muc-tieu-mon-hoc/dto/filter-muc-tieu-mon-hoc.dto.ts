import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class FilterMucTieuMonHoc extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  idSyllabus: number;

  @ApiProperty({ required: false, description: ' this field search by mota , ma ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort a string in column: syllabus, ma, mota, mucDo, updatedAt, createdAt, updatedBy, createdBy'
  })
  @IsOptional()
  @IsIn(['syllabus', 'ma', 'mota', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy'])
  sortBy: 'syllabus' | 'ma' | 'mota' | 'updatedAt' | 'createdAt' | 'updatedBy' | 'createdBy';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType?: 'ASC' | 'DESC';
}
