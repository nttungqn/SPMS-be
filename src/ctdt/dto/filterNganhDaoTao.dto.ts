import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterNganhDaoTaoDto extends BaseFilterDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, description: 'this field search by Ten' })
  readonly search: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  readonly maNganhDaoTao?: string;
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: false, description: 'this field search by ChuongTrinhDaoTaoID' })
  readonly chuongTrinhDaoTao?: number;
}
