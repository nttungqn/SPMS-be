import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterSoKhopNganhDaoTao {
  @ApiProperty({ required: true })
  @IsString()
  khoaTuyenNam1: string;

  @ApiProperty({ required: true })
  @IsString()
  khoaTuyenNam2: string;
}
