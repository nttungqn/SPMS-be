import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FilterSoKhopNganhDaoTao {
  @ApiProperty({ required: true })
  @IsNumberString()
  khoaTuyenNam1: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  khoaTuyenNam2: string;
}
