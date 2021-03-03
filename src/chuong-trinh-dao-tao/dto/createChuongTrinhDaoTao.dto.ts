import { ApiProperty } from '@nestjs/swagger';

export class CreateChuongTrinhDaoTaoDto {
  @ApiProperty({ required: false })
  readonly maCTDT?: string;

  @ApiProperty({ required: false })
  readonly loaiHinh?: string;

  @ApiProperty({ required: false })
  readonly ten?: string;

  @ApiProperty({ required: false })
  readonly trinhDo?: string;

  @ApiProperty({ required: false, example: 0 })
  readonly tongTinChi?: number;

  @ApiProperty({ required: false })
  readonly doiTuong?: string;

  @ApiProperty({ required: false })
  readonly quiTrinhDaoTao?: string;

  @ApiProperty({ required: false })
  readonly dieuKienTotNghiep?: string;
}
