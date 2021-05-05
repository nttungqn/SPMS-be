import { ApiProperty } from '@nestjs/swagger';
import { GomNhomEntity } from 'gom-nhom/entity/gom-nhom.entity';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';

@Entity(TABLE_NAME.CHITIETGOMNHOM)
export class ChiTietGomNhomEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ApiProperty()
  @ManyToOne(() => GomNhomEntity, (monHoc) => monHoc.chiTietGomNhom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_GomNhom' })
  @Column({ name: 'ID_GomNhom' })
  idGN?: number;

  @ApiProperty()
  @ManyToOne(() => MonHocEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_MonHoc' })
  @Column({ name: 'ID_MonHoc' })
  idMH?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  ghiChu?: string;

  @ManyToOne(() => GomNhomEntity, (gomNhom) => gomNhom.chiTietGomNhom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_GomNhom' })
  gomNhom?: GomNhomEntity;

  @OneToOne(() => MonHocEntity, (monHoc) => monHoc.chiTietGomNhom)
  @JoinColumn({ name: 'ID_MonHoc' })
  monHoc?: MonHocEntity;

  @ApiProperty()
  @OneToOne(() => ChiTietGomNhomEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCTGNMonHocTruoc' })
  @Column({ name: 'idCTGNMonHocTruoc' })
  ctgnMonHoctruoc?: ChiTietGomNhomEntity;

  @ApiProperty()
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
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
