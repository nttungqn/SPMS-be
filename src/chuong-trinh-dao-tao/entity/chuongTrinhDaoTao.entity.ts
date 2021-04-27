import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity('ChuongTrinhDaoTao')
export class ChuongTrinhDaoTaoEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'MaCTDT' })
  maCTDT: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'LoaiHinh' })
  loaiHinh: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'Ten' })
  ten: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'TrinhDo' })
  trinhDo: string;

  @IsInt()
  @ApiProperty()
  @Column({ default: 0, name: 'TongTinChi' })
  tongTinChi: number;

  @IsString()
  @ApiProperty()
  @Column({ name: 'DoiTuong' })
  doiTuong: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'QuiTrinhDaoTao' })
  quiTrinhDaoTao: string;

  @IsString()
  @ApiProperty()
  @Column({ name: 'DieuKienTotNghiep' })
  dieuKienTotNghiep: string;

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
}
