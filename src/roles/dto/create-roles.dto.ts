import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateRolesDto {
  @ApiProperty()
  @Column({ name: 'name' })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Column({ name: 'value' })
  @IsOptional()
  value?: number;
}
