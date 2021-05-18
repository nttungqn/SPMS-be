import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterIsExistCTDT {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  ten?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  maCTDT?: string;
}
