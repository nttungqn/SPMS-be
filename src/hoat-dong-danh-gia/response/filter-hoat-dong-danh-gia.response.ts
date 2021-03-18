import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { HoatDongDanhGiaResponse } from './hoat-dong-danh-gia.response';

export class FilterHoatDongDanhGiaResponse extends BaseResponseDto {
  @ApiProperty({ type: [HoatDongDanhGiaResponse] })
  contents: HoatDongDanhGiaResponse[];
}
