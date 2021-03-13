import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { MucTieuMonHocResponse } from './muc-tieu-mon-hoc.response';

export class FindAllMucTieuMonHocResponse extends BaseResponseDto {
  @ApiProperty({ type: [MucTieuMonHocResponse] })
  contents: MucTieuMonHocResponse[];
}
