import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { ResourceEntity } from 'resources/entity/resource.entity';
import { RolesEntity } from 'roles/entity/roles.entity';
import { PrimaryGeneratedColumn, Column, Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: TABLE_NAME.PERMISSION })
export class PermissionEntity {
  @PrimaryColumn({ name: 'idRole' })
  @OneToOne(() => RolesEntity)
  @JoinColumn({ name: 'idRole' })
  idRole?: number;

  @ApiProperty()
  @PrimaryColumn({ name: 'resource' })
  @OneToOne(() => ResourceEntity)
  @JoinColumn({ name: 'resource' })
  @IsNotEmpty()
  resource: string;

  @ApiProperty()
  @PrimaryColumn({ name: 'method' })
  @IsNotEmpty()
  method: string;

  @Column({ name: 'isEnable' })
  @ApiProperty()
  isEnable: boolean;
}
