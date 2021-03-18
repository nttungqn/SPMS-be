import { IsNotEmpty } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(TABLE_NAME.NAMHOC)
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
