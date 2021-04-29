import { ApiProperty } from '@nestjs/swagger';
import { isEnum, IsNumber, IsString } from 'class-validator';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateGomNhomDTO {
  @ApiProperty()
  @ManyToOne(() => LoaiKhoiKienThucEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  @Column({ name: 'ID_LoaiKhoiKienThuc' })
  @IsNumber()
  idLKKT?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'Ma_GomNhom' })
  maGN?: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'TieuDe' })
  tieuDe?: string;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'STT' })
  stt?: number;

  @ApiProperty({ enum: ['BB', 'TC'] })
  @IsString()
  @Column({ name: 'LoaiNhom' })
  loaiNhom?: string;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'SoTCBB' })
  soTCBB?: number;
}
