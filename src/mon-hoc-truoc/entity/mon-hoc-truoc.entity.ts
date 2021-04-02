import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: TABLE_NAME.MONHOCTRUOC })
export class MonHocTruocEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMonHoc' })
  monHocThayThe: MonHocEntity;

  @ApiProperty()
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMonHocTruoc' })
  idMonHocTruoc: MonHocEntity;

  @ApiProperty()
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, { eager: true })
  @JoinColumn({ name: 'idKhoaMonHoc' })
  ctndtMonHoc: ChiTietNganhDaoTaoEntity;

  @ApiProperty()
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, { eager: true })
  @JoinColumn({ name: 'idKhoaMonHocTruoc' })
  ctndtMonHocTruoc: ChiTietNganhDaoTaoEntity;
}
