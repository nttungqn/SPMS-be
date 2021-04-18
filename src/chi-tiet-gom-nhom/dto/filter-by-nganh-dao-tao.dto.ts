import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterByNganhDaoTao extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly tenMonHoc?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly maMonHoc?: string;
}
