import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';

export class KeHoachGiangDayDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  maKeHoach: string;

  @ApiProperty()
  tenHocKy: number;

  @ApiProperty()
  sTT: number;

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

export class KeHoachGiangDayResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [KeHoachGiangDayDto] })
  readonly contents: KeHoachGiangDayDto[];
}
