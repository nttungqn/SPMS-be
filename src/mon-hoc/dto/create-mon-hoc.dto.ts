import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Length, Matches, Min } from 'class-validator';
import { Column } from 'typeorm';

export class CreateMonHocDto {
  @ApiProperty()
  @IsNotEmpty()
  @Column({ length: 10, name: 'ma' })
  @Matches(/^[a-zA-Z0-9_|]{1,}$/, { message: 'Mã CTDT: Gồm chữ và số có >= 1 ký tự' })
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
  @Min(0)
  soTinChi: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietLyThuyet' })
  @Min(0)
  soTietLyThuyet: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietThucHanh' })
  @Min(0)
  soTietThucHanh: number;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'soTietTuHoc' })
  @Min(0)
  soTietTuHoc: number;
}
