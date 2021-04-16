import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { TABLE_NAME } from 'constant/constant';
import { HoatDongDanhGiaEntity } from 'hoat-dong-danh-gia/entity/hoat-dong-danh-gia.entity';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.LOAIDANHGIA })
export class LoaiDanhGiaEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ManyToOne(() => Syllabus)
  @JoinColumn({ name: 'idSyllabus' })
  @Column({ name: 'idSyllabus' })
  syllabus?: number;

  @Column({ name: 'ma' })
  ma?: string;

  @Column({ name: 'ten' })
  ten?: string;

  @Column({ name: 'tyLe' })
  tyLe?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;

  @ManyToMany(() => ChuanDauRaMonHocEntity, { cascade: true })
  @JoinTable({
    name: TABLE_NAME.LOAIDANHGIA_CHUANDAURAMONHOC,
    joinColumn: { name: 'idLoaiDanhGia', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idChuanDauRaMonHoc', referencedColumnName: 'id' }
  })
  chuanDauRaMonHoc?: ChuanDauRaMonHocEntity[];

  @OneToMany(() => HoatDongDanhGiaEntity, (hddg) => hddg.loaiDanhGia)
  @JoinColumn({ name: 'id' })
  hoatDongDanhGia?: HoatDongDanhGiaEntity[];
}
export const KEY_LDG = {
  idSyllabus: 'syllabus',
  ma: 'ma',
  ten: 'ten',
  tyLe: 'tyLe'
};
