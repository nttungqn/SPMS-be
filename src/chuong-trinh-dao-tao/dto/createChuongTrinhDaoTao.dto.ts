import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateChuongTrinhDaoTaoDto {
  @ApiProperty({ required: false })
  @IsString()
  readonly maCTDT?: string;

  @IsString()
  @ApiProperty({ required: false })
  readonly loaiHinh?: string;

  @IsString()
  @ApiProperty({ required: false })
  readonly ten?: string;

  @IsString()
  @ApiProperty({ required: false })
  readonly trinhDo?: string;

  @IsInt()
  @ApiProperty({ required: false, example: 0 })
  readonly tongTinChi?: number;

  @IsString()
  @ApiProperty({ required: false })
  readonly doiTuong?: string;

  @IsString()
  @ApiProperty({ required: false })
  readonly quiTrinhDaoTao?: string;

  @IsString()
  @ApiProperty({ required: false })
  readonly dieuKienTotNghiep?: string;
}
