import { GomNhomEntity } from 'gom-nhom/entity/gom-nhom.entity';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { IsNumberString } from 'class-validator';

export class CreateChiTietGomNhomDTO {
  @ApiProperty()
  @ManyToOne(() => GomNhomEntity)
  @JoinColumn({ name: 'ID_GomNhom' })
  @Column({ name: 'ID_GomNhom' })
  @IsNumberString()
  idGN?: number;

  @ApiProperty()
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'ID_MonHoc' })
  @Column({ name: 'ID_MonHoc' })
  @IsNumberString()
  idMH?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  ghiChu?: string;
}
