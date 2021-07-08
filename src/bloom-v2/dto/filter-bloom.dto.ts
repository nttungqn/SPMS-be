import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBloomV2 {
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ required: false })
  mucDo: string[];
}
