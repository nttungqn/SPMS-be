import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateChuongTrinhDaoTaoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{5,10}$/, { message: 'Gồm số hoặc chữ và có 5 - 10 ký tự' })
  readonly maCTDT?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly loaiHinh?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Length(5)
  readonly ten?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly trinhDo?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly doiTuong?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Length(5)
  readonly quiTrinhDaoTao?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @Length(5)
  readonly dieuKienTotNghiep?: string;
}

export class CreateDetailChuongTrinhDaoTaoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  readonly maCTDT?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly loaiHinh?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly ten?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly trinhDo?: string;

  // @IsInt()
  // @ApiProperty({ required: false, example: 0 })
  // @IsNotEmpty()
  // readonly tongTinChi?: number;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly doiTuong?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly quiTrinhDaoTao?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  readonly dieuKienTotNghiep?: string;

  @ApiProperty()
  @IsArray()
  @Type(() => ChiTietNganhDaoTaoBody)
  readonly payload: ChiTietNganhDaoTaoBody[];
}

class ChiTietNganhDaoTaoBody {
  @ApiProperty()
  @IsString()
  maNganhDaoTao: string;

  @IsString()
  @ApiProperty()
  ten: string;

  @ApiProperty()
  @IsInt()
  khoa: number;

  @IsString()
  @ApiProperty({ required: false })
  coHoiNgheNghiep: string;

  @IsString()
  @ApiProperty({ required: false })
  mucTieuChung: string;
}
