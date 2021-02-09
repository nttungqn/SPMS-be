import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  readonly firstName: string;
  @ApiProperty()
  readonly lastName: string;
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
  @ApiProperty({ default: 1 })
  readonly role: number;
}
