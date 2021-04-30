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

  @ApiProperty({ required: false })
  @IsOptional()
  sortBy: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
