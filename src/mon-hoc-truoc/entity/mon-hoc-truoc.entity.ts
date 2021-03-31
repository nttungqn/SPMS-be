import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: TABLE_NAME.MONHOCTRUOC })
export class MonHocTruocEntity {
  @ApiProperty()
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMonHoc' })
  @PrimaryColumn({ name: 'idMonHoc' })
  monHocThayThe: MonHocEntity;

  @ApiProperty()
  @ManyToOne(() => MonHocEntity)
  @PrimaryColumn({ name: 'idMonHocTruoc' })
  @JoinColumn({ name: 'idMonHocTruoc' })
  @Column({ name: 'idMonHocTruoc' })
  idMonHocTruoc: number;

  @ApiProperty()
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, { eager: true })
  @JoinColumn({ name: 'idKhoaMonHoc' })
  @PrimaryColumn({ name: 'idKhoaMonHoc' })
  ctndtMonHoc: ChiTietNganhDaoTaoEntity;

  @ApiProperty()
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, { eager: true })
  @JoinColumn({ name: 'idKhoaMonHocTruoc' })
  @PrimaryColumn({ name: 'idKhoaMonHocTruoc' })
  ctndtMonHocTruoc: ChiTietNganhDaoTaoEntity;
}
