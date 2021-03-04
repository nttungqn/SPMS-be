import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class SignUpDto {
  @IsString()
  @ApiProperty()
  readonly firstName: string;
  @ApiProperty()
  @IsString()
  readonly lastName: string;
  @ApiProperty()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi)
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
}
