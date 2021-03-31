import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty({ required: true, description: 'Link reset password will be sent to this email.' })
  @IsString()
  @IsEmail()
  readonly email: string;
}
