import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';

export class ChiTietNganhDaoTaoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  khoa: number;

  @ApiProperty()
  tongTinChi: number;

  @ApiProperty()
  coHoiNgheNghiep: string;

  @ApiProperty()
  mucTieuChung: string;

  @ApiProperty()
  nganhDaoTao: number;

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

export class ChiTietNganhDaoTaoResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [ChiTietNganhDaoTaoDto] })
  readonly contents: ChiTietNganhDaoTaoDto[];
}
