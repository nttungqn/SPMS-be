import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsOptional, IsNumberString } from 'class-validator';

export class FilterCTNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'khóa tuyển của ngành đào tạo' })
  @IsNumberString()
  @IsOptional()
  khoa: number;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'id của ngành đào tạo' })
  nganhDaoTao: number;
}
