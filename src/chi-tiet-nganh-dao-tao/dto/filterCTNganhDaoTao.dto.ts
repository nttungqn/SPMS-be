import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterCTNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  khoa: number;

  @ApiProperty({ required: false })
  nganhDaoTao: number;
}
