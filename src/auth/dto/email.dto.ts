import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty({ required: true, description: 'Link reset password will be sent to this email.' })
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi)
  readonly email: string;
}
