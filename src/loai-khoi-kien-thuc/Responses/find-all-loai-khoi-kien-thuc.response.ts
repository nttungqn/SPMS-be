import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { LoaiKhoiKienThucResponse } from './Loai-khoi-kien-thuc.response';

export class FindAllLoaiKhoiKienThuc extends BaseResponseDto {
  @ApiProperty({ type: [LoaiKhoiKienThucResponse] })
  contents: LoaiKhoiKienThucResponse[];
}
