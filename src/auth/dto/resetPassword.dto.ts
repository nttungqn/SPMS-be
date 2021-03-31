import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPassworDto {
  @IsString()
  @ApiProperty()
  readonly password: string;
  @IsString()
  @ApiProperty()
  readonly passwordConfirm: string;
}
