import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NamHoc')
export class NamHocEntity {
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
