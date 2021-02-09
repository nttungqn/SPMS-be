import { RolesEntity } from 'roles/entity/roles.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  ID: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @OneToOne(() => RolesEntity, (role) => role.name)
  @JoinColumn()
  role: number;
  @Column({ default: new Date() })
  createdAt: Date;
  @Column()
  updatedAt: Date;
  @Column({ default: false })
  isDeleted: boolean;
}
