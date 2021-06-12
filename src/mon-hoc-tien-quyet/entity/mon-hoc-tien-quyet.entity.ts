import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, Min } from 'class-validator';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { LoaiMonHoc } from 'mon-hoc-tien-quyet/enum/loai-mon-hoc.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from 'constant/constant';

@Entity(TABLE_NAME.MONHOCTIENQUYET)
export class MonHocTienQuyetEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'idMH' })
  @ManyToOne(() => MonHocEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMH' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  monHoc: number;

  @ApiProperty()
  @Column({ name: 'idMHTQ' })
  @ManyToOne(() => MonHocEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMHTQ' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  monHocTruoc: number;

  @ApiProperty()
  @Column({ name: 'LoaiDK' })
  @IsNotEmpty()
  @IsIn([1, 2])
  loaiMonHoc: LoaiMonHoc;

  @Column({ name: 'createdAt' })
  createdAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
