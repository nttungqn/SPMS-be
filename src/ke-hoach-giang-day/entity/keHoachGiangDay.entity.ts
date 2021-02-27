import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.KEHOACHGIANGDAY)
export class KeHoachGiangDayEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @ApiProperty()
  @Column()
  MaKeHoach: string;

  @ApiProperty()
  @Column()
  TenHocKy: number;

  @ApiProperty()
  @Column()
  STT: number;

  @ApiProperty()
  @Column({ name: 'ID_ChiTietNganhDaoTao' })
  @ManyToOne(() => ChiTietNganhDaoTaoEntity)
  @JoinColumn({ name: 'ID_ChiTietNganhDaoTao' })
  NganhDaoTao: number;

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
