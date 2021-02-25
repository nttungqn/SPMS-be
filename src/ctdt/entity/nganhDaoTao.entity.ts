import { ApiProperty } from '@nestjs/swagger';
import { ChuongTrinhDaoTaoEntity } from 'chuong-trinh-dao-tao/entity/chuongTrinhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

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
  @JoinColumn({ name: 'ctdtID' })
  ctdt: number;

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
