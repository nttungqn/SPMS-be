import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ChuDeEntity } from './../../chu-de/entity/chu-de.entity';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';

@Entity(TABLE_NAME.HOATDONGDAYHOC)
export class HoatDongDayHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => ChuDeEntity)
  @JoinColumn({ name: 'idCD' })
  @Column({ name: 'idCD' })
  idCD: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;

  @ApiProperty()
  @Column({ name: 'stt' })
  stt: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
