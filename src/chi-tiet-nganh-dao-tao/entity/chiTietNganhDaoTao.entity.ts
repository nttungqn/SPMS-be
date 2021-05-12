import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { IsInt, IsString } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { NganhDaoTaoEntity } from 'ctdt/entity/nganhDaoTao.entity';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.CHITIETNGANHDAOTAO)
export class ChiTietNganhDaoTaoEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'Khoa' })
  khoa: number;

  @IsString()
  @ApiProperty()
  @Column({ name: 'CoHoiNgheNghiep' })
  coHoiNgheNghiep: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'MucTieuChung' })
  mucTieuChung: string;

  @ApiProperty()
  @IsInt()
  @OneToOne(() => NganhDaoTaoEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_NganhDaoTao' })
  nganhDaoTao: number;

  @Column()
  createdAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;

  @OneToMany(() => KhoiKienThucEntity, (kkt) => kkt.chiTietNganh, {
    onDelete: 'CASCADE',
    persistence: false,
    cascade: true
  })
  khoiKienThucList?: KhoiKienThucEntity[];

  @OneToMany(() => KeHoachGiangDayEntity, (khgd) => khgd.nganhDaoTao, {
    onDelete: 'CASCADE',
    persistence: false,
    cascade: true
  })
  keHoachGiangDayList?: KeHoachGiangDayEntity[];

  @OneToMany(() => ChuanDauRaNganhDaoTaoEntity, (cdr) => cdr.nganhDaoTao, {
    onDelete: 'CASCADE',
    persistence: false,
    cascade: true
  })
  chuanDaura?: ChuanDauRaNganhDaoTaoEntity[];
}
