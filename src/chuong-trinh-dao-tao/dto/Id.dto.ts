import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdDto {
  @ApiProperty({ description: 'id' })
  @IsString()
  readonly id: string;
}
