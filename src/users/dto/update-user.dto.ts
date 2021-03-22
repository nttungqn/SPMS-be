import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { RolesEntity } from './../../roles/entity/roles.entity';

export class UpdateUserDto {
  @ApiProperty()
  @Column()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @OneToOne(() => RolesEntity, (role) => role.name)
  @JoinColumn({ name: 'role' })
  @IsNumberString()
  @IsOptional()
  role: number;
}
