import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsString, IsNumberString, IsOptional } from 'class-validator';

export class FilterKeHoachGiangDayDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'mã kế hoạch' })
  @IsString()
  @IsOptional()
  readonly maKeHoach: string;
  @ApiProperty({ required: false, description: 'id của chi tiết ngành đào tạo' })
  @IsNumberString()
  @IsOptional()
  readonly nganhDaoTao: number;
  @ApiProperty({ required: false, description: 'tên học kỳ' })
  @IsOptional()
  readonly tenHocKy: string;
  @ApiProperty({ required: false, description: 'số thứ tự' })
  @IsNumberString()
  @IsOptional()
  readonly sTT: number;
}
