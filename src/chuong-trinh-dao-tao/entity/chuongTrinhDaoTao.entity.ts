import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity('ChuongTrinhDaoTao')
export class ChuongTrinhDaoTaoEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @ApiProperty()
  @Column()
  MaCTDT: string;

  @ApiProperty()
  @Column()
  LoaiHinh: string;

  @ApiProperty()
  @Column()
  Ten: string;

  @ApiProperty()
  @Column()
  TrinhDo: string;

  @ApiProperty()
  @Column({ default: 0 })
  TongTinChi: number;

  @ApiProperty()
  @Column()
  DoiTuong: string;

  @ApiProperty()
  @Column()
  QuiTrinhDaoTao: string;

  @ApiProperty()
  @Column()
  DieuKienTotNghiep: string;

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
