import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterNganhDaoTaoDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'trường này dùng để search theo tên' })
  readonly search: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'mã ngành đào tạo' })
  readonly maNganhDaoTao?: string;
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, description: 'id của chương trình đào tạo' })
  readonly chuongTrinhDaoTao?: number;
}
