import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class FilterIsExistChiTietCTDT {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  khoa?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ required: true })
  @IsNotEmpty()
  idNganhDaoTao?: number;
}
