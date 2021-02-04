import { ApiProperty } from '@nestjs/swagger';

export class IdDto {
  @ApiProperty({})
  readonly id: string;
}
