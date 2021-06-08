import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class IdExportDto {
  @IsNumberString()
  @ApiProperty({})
  readonly id: number;
}
