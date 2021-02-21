import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn()
  ID: number;
  @Column()
  name: string;
  @Column({ default: new Date() })
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ default: false })
  isDeleted: boolean;
}
