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
  readonly email: string;
  @ApiProperty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsString()
  readonly password: string;
}
