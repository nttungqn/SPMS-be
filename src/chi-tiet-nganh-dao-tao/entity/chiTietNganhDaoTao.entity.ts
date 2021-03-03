import { ApiProperty } from '@nestjs/swagger';
import { TABLE_NAME } from 'constant/constant';
import { NganhDaoTaoEntity } from 'ctdt/entity/nganhDaoTao.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.CHITIETNGANHDAOTAO)
export class ChiTietNganhDaoTaoEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @ApiProperty()
  @Column({ name: 'Khoa' })
  khoa: number;

  @ApiProperty()
  @Column({ name: 'CoHoiNgheNghiep' })
  coHoiNgheNghiep: string;

  @ApiProperty()
  @Column({ name: 'MucTieuChung' })
  mucTieuChung: string;

  @ApiProperty()
  @OneToOne(() => NganhDaoTaoEntity)
  @JoinColumn({ name: 'ID_NganhDaoTao' })
  nganhDaoTao: number;

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
