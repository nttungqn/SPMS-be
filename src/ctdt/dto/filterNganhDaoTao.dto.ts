import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsString } from 'class-validator';

export class FilterNganhDaoTaoDto extends BaseFilterDto {
  @IsString()
  @ApiProperty({ required: false, description: 'this field search by Ten' })
  readonly search: string;
  @IsString()
  @ApiProperty({ required: false })
  readonly maNganhDaoTao?: string;
  @IsInt()
  @ApiProperty({ required: false, description: 'this field search by ChuongTrinhDaoTaoID' })
  readonly chuongTrinhDaoTao?: number;
}
