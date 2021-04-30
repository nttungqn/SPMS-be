import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterHoatDongDayHoc extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by ten , ma ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sortBy: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType?: 'ASC' | 'DESC';
}
