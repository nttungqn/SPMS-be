import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { TABLE_NAME } from 'constant/constant';
import { LoaiDanhGiaEntity } from 'loai-danh-gia/entity/loai-danh-gia.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.HOATDONGDANHGIA })
export class HoatDongDanhGiaEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @Column({ name: 'idLDG' })
  @ManyToOne(() => LoaiDanhGiaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idLDG', referencedColumnName: 'id' })
  loaiDanhGia?: number;

  @Column({ name: 'ma' })
  ma?: string;

  @Column({ name: 'ten' })
  ten?: string;

  @Column({ name: 'moTa' })
  moTa?: string;

  @Column({ name: 'tyLe' })
  tyLe?: number;

  @ManyToMany(() => ChuanDauRaMonHocEntity, { cascade: true })
  @JoinTable({
    name: TABLE_NAME.HOATDONGDANHGIA_CHUANDAURAMONHOC,
    joinColumn: { name: 'idHDDG', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idCDRMH', referencedColumnName: 'id' }
  })
  chuanDauRaMonHoc?: ChuanDauRaMonHocEntity[];

  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
export const KeyHDDG = {
  ten: 'ten',
  ma: 'ma',
  tyLe: 'tyLe',
  moTa: 'moTa',
  idLoaiDanhGia: 'loaiDanhGia'
};
