import { ApiProperty } from '@nestjs/swagger';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { MonHocTienQuyetEntity } from 'mon-hoc-tien-quyet/entity/mon-hoc-tien-quyet.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';
import { CreateMonHocDto } from './../dto/create-mon-hoc.dto';

@Entity(TABLE_NAME.MONHOC)
export class MonHocEntity extends CreateMonHocDto {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @OneToOne(() => ChiTietGomNhomEntity, (chiTietGomNhom) => chiTietGomNhom.monHoc)
  chiTietGomNhom?: ChiTietGomNhomEntity[];

  @OneToMany(() => MonHocTienQuyetEntity, (mhtq) => mhtq.monHoc)
  @JoinColumn({ name: 'id', referencedColumnName: 'monHoc' })
  monHocTienQuyet?: MonHocTienQuyetEntity[];

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @ApiProperty()
  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @ApiProperty()
  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @ApiProperty()
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
