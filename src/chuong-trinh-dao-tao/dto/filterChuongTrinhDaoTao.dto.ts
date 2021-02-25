import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  readonly limit?: number;
}

export class FilterChuongTrinhDaoTao extends BaseFilterDto {}
