import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { MonHocTienQuyetResponse } from './mon-hoc-tien-quyet.response';

export class FindAllMonHocTienQuyetResponse extends BaseResponseDto {
  @ApiProperty({ type: [MonHocTienQuyetResponse] })
  contents: MonHocTienQuyetResponse[];
}
