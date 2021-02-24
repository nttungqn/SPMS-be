import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterCTNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  Khoa: number;

  @ApiProperty({ required: false })
  NganhDaoTao: number;
}
