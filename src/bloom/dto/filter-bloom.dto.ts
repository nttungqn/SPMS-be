import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBloom {
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ required: false })
  mucDo: string[];
}
