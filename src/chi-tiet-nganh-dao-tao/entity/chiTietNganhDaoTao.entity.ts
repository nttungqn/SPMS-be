import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { NganhDaoTaoEntity } from 'ctdt/entity/nganhDaoTao.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.CHITIETNGANHDAOTAO)
export class ChiTietNganhDaoTaoEntity {
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
}
