import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { LoaiMonHoc } from 'mon-hoc-tien-quyet/enum/loai-mon-hoc.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity('MonHoc_MonHocTienQuyet')
export class MonHocTienQuyetEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'idMH' })
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMH' })
  @IsNotEmpty()
  @IsInt()
  monHoc: number;

  @ApiProperty()
  @Column({ name: 'idMHTQ' })
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMHTQ' })
  @IsNotEmpty()
  @IsInt()
  monHocTruoc: number;

  @ApiProperty()
  @Column({ name: 'LoaiDK' })
  @IsNotEmpty()
  @IsIn([1, 2])
  loaiMonHoc: LoaiMonHoc;

  @Column({ name: 'createdAt' })
  createdAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
