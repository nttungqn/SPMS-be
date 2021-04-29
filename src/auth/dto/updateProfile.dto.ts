import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly firstName: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly lastName: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly username: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly avatar: string;
}
