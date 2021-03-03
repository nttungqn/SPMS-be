import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateLoaiKhoiKienThucDto {
  //@Column({name:'ID_KhoiKienThuc'})
  @ApiProperty()
  @IsNotEmpty()
  @ManyToOne(() => KhoiKienThucEntity)
  @JoinColumn({ name: 'ID_KhoiKienThuc' })
  khoiKienThuc?: number;

  @ApiProperty()
  @Column({ name: 'Ma_LoaiKhoiKT' })
  @IsNotEmpty()
  maLoaiKhoiKienThuc?: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  @IsNotEmpty()
  ten?: string;

  @ApiProperty()
  @Column({ name: 'TongTC' })
  @IsNotEmpty()
  tongTinChi?: number;

  @ApiProperty()
  @Column({ name: 'NoiDung' })
  noidung?: string;
}
