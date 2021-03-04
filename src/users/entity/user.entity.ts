import { RolesEntity } from 'roles/entity/roles.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;
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
  @Column({ default: false })
  isActive: boolean;
  @Column({ name: 'tokenVerifyEmail' })
  tokenVerifyEmail: string;
}
