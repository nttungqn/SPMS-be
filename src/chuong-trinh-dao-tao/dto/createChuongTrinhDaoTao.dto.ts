import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChuongTrinhDaoTaoDto {
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

  @IsInt()
  @ApiProperty({ required: false, example: 0 })
  @IsNotEmpty()
  readonly tongTinChi?: number;

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
}
