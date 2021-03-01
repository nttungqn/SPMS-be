import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  readonly firstName: string;
  @ApiProperty({ required: false })
  readonly lastName: string;
  @ApiProperty({ required: false })
  readonly email: string;
}
