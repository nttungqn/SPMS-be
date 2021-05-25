import { TABLE_NAME } from 'constant/constant';
import { PermissionEntity } from 'permission/entity/permission.entity';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: TABLE_NAME.RESOURCE })
export class ResourceEntity {
  @PrimaryColumn({ name: 'name' })
  name: string;

  @Column({ name: 'description' })
  description: string;

  @OneToMany(() => PermissionEntity, (pms) => pms.resource)
  permission: PermissionEntity[];
}
