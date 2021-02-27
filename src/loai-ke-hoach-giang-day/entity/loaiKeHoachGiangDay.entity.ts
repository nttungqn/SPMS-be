import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from './../../users/entity/user.entity';

@Entity('LoaiKeHoachGiangDay')
export class LoaiKeHoachGiangDayEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  ID: number;

  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  Ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  Ten: string;

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
