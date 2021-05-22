import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { PermissionEntity } from 'permission/entity/permission.entity';
import { Column } from 'typeorm';

export class CreateRolesDto {
  @ApiProperty()
  @Column({ name: 'name' })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Column({ name: 'value', default: 0 })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({ type: [PermissionEntity] })
  @IsOptional()
  permissions?: PermissionEntity[];
}
