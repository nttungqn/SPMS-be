import { TABLE_NAME } from 'constant/constant';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity({ name: TABLE_NAME.PERMISSION })
export class PermissionEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'path' })
  path: string;
  @Column({ name: 'method' })
  method: string;

  @Column({ name: 'actived' })
  actived: boolean;
}
