import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateRolesDto {
  @ApiProperty()
  @Column({ name: 'name' })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Column({ name: 'value', default: 0 })
  @IsOptional()
  @IsNumberString()
  value?: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[];
}
