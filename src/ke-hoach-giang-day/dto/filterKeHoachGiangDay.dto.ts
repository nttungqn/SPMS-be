import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsString } from 'class-validator';

export class FilterKeHoachGiangDayDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  readonly MaKeHoach: string;
  @ApiProperty({ required: false })
  @IsInt()
  readonly NganhDaoTao: number;
  @ApiProperty({ required: false })
  @IsInt()
  readonly TenHocKy: number;
  @ApiProperty({ required: false })
  @IsInt()
  readonly STT: number;
}
