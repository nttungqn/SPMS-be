import { IsNotEmpty } from 'class-validator';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity('HeDaoTao')
export class HeDaoTaoEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @IsNotEmpty()
  @Column({ name: 'ma' })
  ma: string;
  @IsNotEmpty()
  @Column({ name: 'ten' })
  ten: string;
  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
