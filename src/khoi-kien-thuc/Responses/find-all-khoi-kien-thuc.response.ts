import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { KhoiKienThucResponse } from './khoi-kien-thuc.response';

export class FindAllKhoiKienThuc extends BaseResponseDto {
  @ApiProperty({ type: [KhoiKienThucResponse] })
  contents: KhoiKienThucResponse[];
}
