import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterRoles extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  searchKey: string;

  @ApiProperty({ required: false, description: 'Sort a string in column: name,value,updatedAt,createdAt' })
  @IsOptional()
  @IsIn(['name', 'value', 'updatedAt', 'createdAt'])
  sortBy: 'name' | 'value' | 'updatedAt' | 'createdAt';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
