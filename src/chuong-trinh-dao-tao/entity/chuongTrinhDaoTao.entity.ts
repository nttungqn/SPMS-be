import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity('ChuongTrinhDaoTao')
export class ChuongTrinhDaoTaoEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @ApiProperty()
  @Column({ name: 'MaCTDT' })
  maCTDT: string;

  @ApiProperty()
  @Column({ name: 'LoaiHinh' })
  loaiHinh: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  ten: string;

  @ApiProperty()
  @Column({ name: 'TrinhDo' })
  trinhDo: string;

  @ApiProperty()
  @Column({ default: 0, name: 'TongTinChi' })
  tongTinChi: number;

  @ApiProperty()
  @Column({ name: 'DoiTuong' })
  doiTuong: string;

  @ApiProperty()
  @Column({ name: 'QuiTrinhDaoTao' })
  quiTrinhDaoTao: string;

  @ApiProperty()
  @Column({ name: 'DieuKienTotNghiep' })
  dieuKienTotNghiep: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
