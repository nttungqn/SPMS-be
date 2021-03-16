import { ApiProperty } from '@nestjs/swagger';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateGomNhomDTO {
  @ApiProperty()
  @ManyToOne(() => LoaiKhoiKienThucEntity)
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  @Column({ name: 'ID_LoaiKhoiKienThuc' })
  idLKKT: number;

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
}
