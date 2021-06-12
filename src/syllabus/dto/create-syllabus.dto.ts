import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { HeDaoTaoEntity } from 'he-dao-tao/entity/type-of-education.entity';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { NamHocEntity } from 'nam-hoc/entity/nam-hoc.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateSyllabusDto {
  @ApiProperty({ description: 'IdMonHoc' })
  @IsInt()
  @Column({ name: 'idMH' })
  @ManyToOne(() => MonHocEntity, { eager: true })
  @JoinColumn({ name: 'idMH' })
  @Min(1)
  monHoc?: number;

  @ApiProperty({ description: 'Id Hệ Đào Tạo' })
  @IsInt()
  @Column({ name: 'idHDT' })
  @ManyToOne(() => HeDaoTaoEntity, { eager: true })
  @JoinColumn({ name: 'idHDT' })
  @Min(1)
  heDaoTao?: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'idNH' })
  @ManyToOne(() => NamHocEntity)
  @JoinColumn({ name: 'idNH' })
  @Min(1)
  namHoc?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ name: 'TaiNguyen' })
  taiNguyen?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ name: 'quiDinh' })
  quiDinh?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ name: 'moTa' })
  moTa?: string;
}
