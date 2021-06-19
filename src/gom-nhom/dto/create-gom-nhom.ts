import { ApiProperty } from '@nestjs/swagger';
import { isEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateGomNhomDTO {
  @ApiProperty()
  @ManyToOne(() => LoaiKhoiKienThucEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  @Column({ name: 'ID_LoaiKhoiKienThuc' })
  @IsNumber()
  @Min(1)
  idLKKT?: number;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'Ma_GomNhom' })
  @IsOptional()
  maGN?: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'TieuDe' })
  // @Length(5)
  tieuDe?: string;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'STT' })
  @Min(1)
  stt?: number;

  @ApiProperty({ enum: ['BB', 'TC'] })
  @IsString()
  @Column({ name: 'LoaiNhom' })
  @IsIn(['BB', 'TC'])
  loaiNhom?: string;

  @ApiProperty()
  @IsNumber()
  @Column({ name: 'SoTCBB' })
  @Min(1)
  soTCBB?: number;
}
