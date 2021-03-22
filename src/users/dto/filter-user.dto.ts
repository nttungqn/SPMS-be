import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number;

  @ApiProperty({ required: false, description: 'search a string in column : firstname, lastname, email, username' })
  @IsOptional()
  readonly search?: string;
}

export class FilterUser extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'type: number, phân quyền user' })
  @IsNumberString()
  @IsOptional()
  readonly role?: number;
}
