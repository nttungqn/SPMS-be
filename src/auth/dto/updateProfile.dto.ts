import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  readonly firstName: string;
  @ApiProperty({ required: false })
  @IsString()
  readonly lastName: string;
  @ApiProperty({ required: false })
  @IsString()
  readonly username: string;
}
