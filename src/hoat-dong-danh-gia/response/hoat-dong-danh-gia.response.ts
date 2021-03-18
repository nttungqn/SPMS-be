import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaMonHocResponse } from 'chuan-dau-ra-mon-hoc/responses/chuan-dau-ra-mon-hoc.response';
import { UserResponse } from 'users/Responses/user.response';

export class HoatDongDanhGiaResponse {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  loaiDanhGia?: number;
  @ApiProperty()
  ma?: string;
  @ApiProperty()
  ten?: string;
  @ApiProperty()
  moTa?: string;
  @ApiProperty()
  tyLe?: number;
  @ApiProperty({ type: [ChuanDauRaMonHocResponse] })
  chuanDauRaMonHoc?: ChuanDauRaMonHocResponse[];
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty({ type: UserResponse })
  createdBy?: UserResponse;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty({ type: UserResponse })
  updatedBy?: UserResponse;
  @ApiProperty()
  isDeleted?: boolean;
}
