import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateLoaiKhoiKienThucDto {
  //@Column({name:'ID_KhoiKienThuc'})
  @ApiProperty()
  @IsNotEmpty()
  @ManyToOne(() => KhoiKienThucEntity)
  @JoinColumn({ name: 'ID_KhoiKienThuc' })
  @Min(1)
  khoiKienThuc?: number;

  @ApiProperty()
  @Column({ name: 'Ma_LoaiKhoiKT' })
  @IsOptional()
  maLoaiKhoiKienThuc?: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  @IsNotEmpty()
  @Length(5)
  ten?: string;

  @ApiProperty()
  @Column({ name: 'TongTC' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  tongTinChi?: number;

  @ApiProperty()
  @Column({ name: 'NoiDung' })
  @IsOptional()
  noidung?: string;
}
