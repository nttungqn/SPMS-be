import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterChuanDauRaNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  readonly ma: string;

  @ApiProperty({ required: false })
  readonly parent: number;

  @ApiProperty({ required: false })
  readonly nganhDaoTao: number;

  @ApiProperty({ required: false })
  readonly chuanDauRa: number;
}
