import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterKeHoachGiangDayDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  readonly MaKeHoach: string;
  @ApiProperty({ required: false })
  readonly NganhDaoTao: number;
  @ApiProperty({ required: false })
  readonly TenHocKy: number;
  @ApiProperty({ required: false })
  readonly STT: number;
}
