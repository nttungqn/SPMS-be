import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { Column, JoinTable, ManyToMany } from 'typeorm';

export class CreateMonHocDto {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 10, name: 'ma' })
  ma: string;

  @ApiProperty()
  @IsNotEmpty()
  @Column({ name: 'tenTiengViet' })
  tenTiengViet: string;

  @ApiProperty()
  @IsOptional()
  @Column({ name: 'tenTiengAnh' })
  tenTiengAnh: string;

  @ApiProperty()
  @IsNumberString()
  @Column({ name: 'soTinChi' })
  soTinChi: number;

  @ApiProperty()
  @IsNumberString()
  @Column({ name: 'soTietLyThuyet' })
  soTietLyThuyet: number;

  @ApiProperty()
  @IsNumberString()
  @Column({ name: 'soTietThucHanh' })
  soTietThucHanh: number;

  @ApiProperty()
  @IsNumberString()
  @Column({ name: 'soTietTuHoc' })
  soTietTuHoc: number;

  @ApiProperty()
  @IsOptional()
  @Column({ name: 'moTa' })
  moTa: string;

  @ApiProperty()
  @IsOptional()
  @Column({ name: 'taiNguyen' })
  taiNguyen: string;
}
