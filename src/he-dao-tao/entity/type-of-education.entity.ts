import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity('HeDaoTao')
export class HeDaoTaoEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ name: 'ma' })
  ma: string;
  @Column({ name: 'ten' })
  ten: string;
  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
