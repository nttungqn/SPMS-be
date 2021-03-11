import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './BaseResponse';
export class ChuongTrinhDaoTaoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  maCTDT: string;

  @ApiProperty()
  loaiHinh: string;

  @ApiProperty()
  ten: string;

  @ApiProperty()
  trinhDo: string;

  @ApiProperty()
  tongTinChi: number;

  @ApiProperty()
  doiTuong: string;

  @ApiProperty()
  quiTrinhDaoTao: string;

  @ApiProperty()
  dieuKienTotNghiep: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  isDeleted: boolean;
}
export class ChuongTrinhDaoTaoResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [ChuongTrinhDaoTaoDto] })
  readonly contents: ChuongTrinhDaoTaoDto[];
}
