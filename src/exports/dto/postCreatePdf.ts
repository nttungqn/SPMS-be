import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class postDataDto {
  @IsString()
  @ApiProperty({})
  readonly data: string;
}
