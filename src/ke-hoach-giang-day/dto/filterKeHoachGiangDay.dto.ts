import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsString, IsNumberString, IsOptional } from 'class-validator';

export class FilterKeHoachGiangDayDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'mã kế hoạch' })
  @IsString()
  @IsOptional()
  readonly MaKeHoach: string;
  @ApiProperty({ required: false, description: 'id của ngành đào tạo' })
  @IsNumberString()
  @IsOptional()
  readonly NganhDaoTao: number;
  @ApiProperty({ required: false, description: 'tên học kỳ' })
  @IsNumberString()
  @IsOptional()
  readonly TenHocKy: number;
  @ApiProperty({ required: false, description: 'số thứ tự' })
  @IsNumberString()
  @IsOptional()
  readonly STT: number;
}
