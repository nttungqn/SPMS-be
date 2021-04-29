import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

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
  @IsInt()
  @Column({ name: 'soTinChi' })
  soTinChi: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietLyThuyet' })
  soTietLyThuyet: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietThucHanh' })
  soTietThucHanh: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietTuHoc' })
  soTietTuHoc: number;
}
