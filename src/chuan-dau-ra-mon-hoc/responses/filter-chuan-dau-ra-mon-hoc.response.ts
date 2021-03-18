import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { ChuanDauRaMonHocResponse } from './chuan-dau-ra-mon-hoc.response';

export class FilterChuanDauRaMonHocResponse extends BaseResponseDto {
  @ApiProperty({ type: [ChuanDauRaMonHocResponse] })
  contents: ChuanDauRaMonHocResponse[];
}
