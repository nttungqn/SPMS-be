import { IsNotEmpty } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity(TABLE_NAME.HEDAOTAO)
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
