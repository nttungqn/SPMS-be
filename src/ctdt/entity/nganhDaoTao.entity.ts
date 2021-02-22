import { ApiProperty } from '@nestjs/swagger';
import { ChuongTrinhDaoTaoEntity } from 'chuong-trinh-dao-tao/entity/chuongTrinhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity(TABLE_NAME.NGANHDAOTAO)
export class NganhDaoTaoEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @ApiProperty()
  @Column()
  MaNganhDaoTao: string;

  @ApiProperty()
  @Column()
  Ten: string;

  @ApiProperty()
  @OneToOne(() => ChuongTrinhDaoTaoEntity)
  @JoinColumn()
  ctdt: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  isDeleted: boolean;
}
