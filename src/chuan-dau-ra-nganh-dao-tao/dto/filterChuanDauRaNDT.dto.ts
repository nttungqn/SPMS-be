import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterChuanDauRaNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly ma: string;

  @ApiProperty({ required: false, description: 'id của mục parent' })
  @IsNumberString()
  @IsOptional()
  readonly parent: number;

  @ApiProperty({ required: false, description: 'id của ngành đào tạo' })
  @IsNumberString()
  @IsOptional()
  readonly nganhDaoTao: number;

  @ApiProperty({ required: false, description: 'id của chuẩn đầu ra' })
  @IsNumberString()
  @IsOptional()
  readonly chuanDauRa: number;
}
