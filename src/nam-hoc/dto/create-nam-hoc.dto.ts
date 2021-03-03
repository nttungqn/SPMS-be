import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateNamHocDto {
  @ApiProperty()
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @Length(5)
  ten?: string;
}
