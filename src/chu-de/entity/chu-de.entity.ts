import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  AfterLoad
} from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';
import { HoatDongDanhGiaEntity } from 'hoat-dong-danh-gia/entity/hoat-dong-danh-gia.entity';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { HoatDongDayHocEntity } from 'hoat-dong-day-hoc/entity/hoat-dong-day-hoc.entity';
import { LoaiKeHoachGiangDayEntity } from 'loai-ke-hoach-giang-day/entity/loaiKeHoachGiangDay.entity';
import { Syllabus } from 'syllabus/entity/syllabus.entity';

@Entity(TABLE_NAME.CHUDE, { orderBy: { tuan: 'ASC' } })
export class ChuDeEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ApiProperty()
  @ManyToOne(() => Syllabus)
  @JoinColumn({ name: 'idSyllabus' })
  @Column({ name: 'idSyllabus' })
  idSyllabus?: number;

  @ApiProperty()
  @ManyToOne(() => LoaiKeHoachGiangDayEntity)
  @JoinColumn({ name: 'idLKHGD' })
  @Column({ name: 'idLKHGD' })
  idLKHGD?: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  ma?: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten?: string;

  @ApiProperty()
  @Column({ name: 'tuan' })
  tuan?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @ApiProperty()
  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @ApiProperty()
  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @ApiProperty()
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;

  @ManyToMany(() => HoatDongDanhGiaEntity, { cascade: true })
  @JoinTable({
    name: TABLE_NAME.CHUDE_HOATDONGDANHGIA,
    joinColumn: { name: 'idChuDe', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idHoatDongDanhGia', referencedColumnName: 'id' }
  })
  hoatDongDanhGia?: HoatDongDanhGiaEntity[];

  @ManyToMany(() => ChuanDauRaMonHocEntity, { cascade: true })
  @JoinTable({
    name: TABLE_NAME.CHUDE_CHUANDAURAMONHOC,
    joinColumn: { name: 'idCD', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idCDRMH', referencedColumnName: 'id' }
  })
  chuanDauRaMonHoc?: ChuanDauRaMonHocEntity[];

  @ManyToMany(() => HoatDongDayHocEntity, { cascade: true })
  @JoinTable({
    name: TABLE_NAME.CHUDE_HOATDONGDAYHOC,
    joinColumn: { name: 'idChuDe', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idHoatDongDayHoc', referencedColumnName: 'id' }
  })
  hoatDongDayHoc?: HoatDongDayHocEntity[];

  @AfterLoad()
  afterLoad() {
    this.hoatDongDanhGia = this.hoatDongDanhGia.filter((e) => {
      return e.isDeleted === false;
    });
    this.chuanDauRaMonHoc = this.chuanDauRaMonHoc.filter((e) => {
      return e.isDeleted === false;
    });
    this.hoatDongDayHoc = this.hoatDongDayHoc.filter((e) => {
      return e.isDeleted === false;
    });
  }
}
export const KEY_CD = {
  idSyllabus: 'idSyllabus',
  idLKHGD: 'idLKHGD',
  ma: 'ma',
  ten: 'ten',
  tuan: 'tuan'
};
