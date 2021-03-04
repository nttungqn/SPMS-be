import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsOptional } from 'class-validator';

export class FilterCTNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  khoa: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  nganhDaoTao: number;
}
