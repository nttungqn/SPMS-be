import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from './../../constant/constant';

@Entity(TABLE_NAME.MONHOC)
export class MonHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  ID: number;

  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  Ma: string;

  @ApiProperty()
  @Column({ name: 'tenTiengViet' })
  TenTiengViet: string;

  @ApiProperty()
  @Column({ name: 'tenTiengAnh' })
  TenTiengAnh: string;

  @ApiProperty()
  @Column({ name: 'soTinChi' })
  SoTinChi: number;

  @ApiProperty()
  @Column({ name: 'soTietLyThuyet' })
  SoTietLyThuyet: number;

  @ApiProperty()
  @Column({ name: 'soTietThucHanh' })
  SoTietThucHanh: number;

  @ApiProperty()
  @Column({ name: 'soTietTuHoc' })
  SoTietTuHoc: number;

  @ApiProperty()
  @Column({ name: 'moTa' })
  MoTa: string;

  @ApiProperty()
  @Column({ name: 'taiNguyen' })
  TaiNguyen: string;

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
