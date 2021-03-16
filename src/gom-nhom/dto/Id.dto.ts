import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class IdDto {
  @ApiProperty({})
  @IsOptional()
  readonly id: string;
}
