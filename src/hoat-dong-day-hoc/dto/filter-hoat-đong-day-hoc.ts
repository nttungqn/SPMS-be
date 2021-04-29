import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterHoatDongDayHoc extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by ten , ma ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort a string in column: ma, ten,updatedAt, createdAt, updatedBy, createdBy'
  })
  @IsOptional()
  @IsIn(['ma', 'ten', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy'])
  sortBy: 'ma' | 'ten' | 'updatedAt' | 'createdAt' | 'updatedBy' | 'createdBy';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType?: 'ASC' | 'DESC';
}
