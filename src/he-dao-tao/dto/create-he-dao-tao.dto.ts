import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateHeDaoTaoDto {
  @ApiProperty()
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @Length(5)
  ten?: string;
}
