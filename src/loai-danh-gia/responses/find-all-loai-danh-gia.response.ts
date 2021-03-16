import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { LoaiDanhGiaResponse } from './loai-danh-gia.response';

export class FindAllLoaiDanhGiaResponse extends BaseResponseDto {
  @ApiProperty({ type: [LoaiDanhGiaResponse] })
  contents: LoaiDanhGiaResponse;
}
