import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateHeDaoTaoDto {
  @ApiProperty()
  // // @Length(5)
  ma?: string;

  @ApiProperty()
  // // @Length(5)
  ten?: string;
}
