import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CreateRolesDto } from './../dto/create-roles.dto';
import { TABLE_NAME } from './../../constant/constant';
import { PermissionEntity } from 'permission/entity/permission.entity';

@Entity({ name: TABLE_NAME.ROLES })
export class RolesEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ApiProperty()
  @Column({ name: 'name' })
  name?: string;

  @ApiProperty()
  @Column({ name: 'value' })
  value?: string;

  @ApiProperty()
  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @ApiProperty()
  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @ApiProperty()
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
