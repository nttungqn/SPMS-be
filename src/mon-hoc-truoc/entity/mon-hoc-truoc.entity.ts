import { ApiProperty } from '@nestjs/swagger';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: TABLE_NAME.MONHOCTRUOC })
export class MonHocTruocEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @OneToOne(() => ChiTietGomNhomEntity)
  @JoinColumn({ name: 'idCTGNMonHoc' })
  ctgnMonHoc: ChiTietGomNhomEntity;

  @OneToOne(() => ChiTietGomNhomEntity)
  @JoinColumn({ name: 'idCTGNMonHocTruoc' })
  ctgnMonHocTruoc: ChiTietGomNhomEntity;
}
