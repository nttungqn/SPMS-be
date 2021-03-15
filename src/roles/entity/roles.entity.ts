import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
  @Column()
  name: string;

  @Column({ name: 'value' })
  value: number;

  @Column({ default: new Date() })
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ default: false })
  isDeleted: boolean;
}
