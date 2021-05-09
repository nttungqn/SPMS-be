import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterNganhDaoTaoDto extends BaseFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'mã ngành đào tạo' })
  readonly maNganhDaoTao?: string;
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, description: 'id của chương trình đào tạo' })
  readonly chuongTrinhDaoTao?: number;

  @ApiProperty({ required: false, description: 'Search by id, maNganhDaoTao, ten' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({ required: false, description: 'Sort by: id, maNganhDaoTao, ten, createdAt, updatedAt' })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
