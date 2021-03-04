import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { ChuanDauRaEntity } from 'chuan-dau-ra/entity/chuanDauRa.entity';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.CHUANDAURANGANHDAOTAO)
export class ChuanDauRaNganhDaoTaoEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @Column()
  ma: string;

  @ApiProperty()
  @OneToOne(() => ChuanDauRaNganhDaoTaoEntity)
  @JoinColumn({ name: 'parentId' })
  parent: number;

  @ApiProperty()
  @OneToOne(() => ChiTietNganhDaoTaoEntity)
  @JoinColumn({ name: 'ID_ChiTietNganhDaoTao' })
  nganhDaoTao: number;

  @ApiProperty()
  @OneToOne(() => ChuanDauRaEntity)
  @JoinColumn({ name: 'ID_ChuanDauRa' })
  chuanDauRa: number;

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
