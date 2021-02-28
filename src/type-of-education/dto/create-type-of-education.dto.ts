import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateTypeOfEducationDto {
  @ApiProperty()
  @IsNotEmpty()
  code?: string;

  @ApiProperty()
  @Length(5)
  name?: string;
}
