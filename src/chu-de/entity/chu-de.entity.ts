import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { LoaiKeHoachGiangDayEntity } from 'loai-ke-hoach-giang-day/entity/loaiKeHoachGiangDay.entity';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';

@Entity(TABLE_NAME.CHUDE)
export class ChuDeEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => Syllabus)
  @JoinColumn({ name: 'idSyllabus' })
  @Column({ name: 'idSyllabus' })
  idSyllabus: number;

  @ApiProperty()
  @ManyToOne(() => LoaiKeHoachGiangDayEntity)
  @JoinColumn({ name: 'idLKHGD' })
  @Column({ name: 'idLKHGD' })
  idLKHGD: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;

  @ApiProperty()
  @Column({ name: 'tuan' })
  tuan: number;

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
