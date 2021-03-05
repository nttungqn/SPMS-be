import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/monHoc.entity';
import { NamHocEntity } from 'nam-hoc/entity/nam-hoc.entity';
import { HeDaoTaoEntity } from 'he-dao-tao/entity/type-of-education.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.SYLLABUS)
export class Syllabus {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'idMH' })
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMH' })
  monHoc: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'idHDT' })
  @ManyToOne(() => HeDaoTaoEntity)
  @JoinColumn({ name: 'idHDT' })
  heDaoTao: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'idNH' })
  @ManyToOne(() => NamHocEntity)
  @JoinColumn({ name: 'idNH' })
  namHoc: number;

  @Column({ name: 'createdBy' })
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column({ name: 'updatedBy' })
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
