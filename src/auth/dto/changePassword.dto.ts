import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  readonly password: string;
  @IsString()
  @ApiProperty()
  readonly newPassword: string;
}
