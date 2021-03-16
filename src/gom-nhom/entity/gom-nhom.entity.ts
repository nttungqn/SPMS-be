import { LoaiKhoiKienThucEntity } from './../../loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';

@Entity(TABLE_NAME.GOMNHOM)
export class GomNhomEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => LoaiKhoiKienThucEntity)
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  @Column({ name: 'ID_LoaiKhoiKienThuc' })
  idLKKT: number;

  @ManyToOne(() => LoaiKhoiKienThucEntity)
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  loaiKhoiKienThuc: LoaiKhoiKienThucEntity;

  @OneToMany(() => ChiTietGomNhomEntity, (chiTietGomNhom) => chiTietGomNhom.gomNhom, { eager: true })
  chiTietGomNhom: ChiTietGomNhomEntity[];

  @ApiProperty()
  @Column({ name: 'Ma_GomNhom' })
  maGN: number;

  @ApiProperty()
  @Column({ name: 'TieuDe' })
  tieuDe: string;

  @ApiProperty()
  @Column({ name: 'STT' })
  stt: number;

  @ApiProperty()
  @Column({ name: 'LoaiNhom' })
  loaiNhom: string;

  @ApiProperty()
  @Column({ name: 'SoTCBB' })
  soTCBB: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
