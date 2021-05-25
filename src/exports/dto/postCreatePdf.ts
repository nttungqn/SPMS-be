import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class postDataDto {
  @IsString()
  @ApiProperty({})
  readonly data: string;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  readonly fileName: string;
}
