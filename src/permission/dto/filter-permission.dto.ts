import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterPermision extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by path and name ' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'name| path | method'
  })
  @IsOptional()
  @IsIn(['name', 'path', 'method'])
  sortBy: 'name' | 'path' | 'method';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
