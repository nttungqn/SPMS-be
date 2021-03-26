import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ required: false, description: 'Trạng thái user - isDeleted: true | false' })
  @IsOptional()
  readonly isDeleted?: boolean;

  @ApiProperty({ required: false, description: 'Trạng thái hoạt động user - isActive: true | false' })
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'Sort by column: id, firstName, lastName, email, username, updatedAt, createdAt'
  })
  @IsIn(['id', 'firstName', 'lastName', 'email', 'username', 'updatedAt', 'createdAt'])
  @IsOptional()
  readonly sortBy?: 'id' | 'firstName' | 'lastName' | 'email' | 'username' | 'updatedAt' | 'createdAt';

  @ApiProperty({ required: false, description: 'Sort by type: ASC, DESC' })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  readonly sortType?: 'ASC' | 'DESC';
}
