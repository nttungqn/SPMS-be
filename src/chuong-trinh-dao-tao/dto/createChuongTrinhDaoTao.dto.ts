import { ApiProperty } from '@nestjs/swagger';

export class CreateChuongTrinhDaoTaoDto {
  @ApiProperty({ required: false })
  readonly MaCTDT?: string;

  @ApiProperty({ required: false })
  readonly LoaiHinh?: string;

  @ApiProperty({ required: false })
  readonly Ten?: string;

  @ApiProperty({ required: false })
  readonly TrinhDo?: string;

  @ApiProperty({ required: false, example: 0 })
  readonly TongTinChi?: number;

  @ApiProperty({ required: false })
  readonly DoiTuong?: string;

  @ApiProperty({ required: false })
  readonly QuiTrinhDaoTao?: string;

  @ApiProperty({ required: false })
  readonly DieuKienTotNghiep?: string;
}
