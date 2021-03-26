import { ApiProperty } from '@nestjs/swagger';
import { KhoiKienThucResponse } from 'khoi-kien-thuc/Responses/khoi-kien-thuc.response';
import { UserResponse } from 'users/Responses/user.response';

export class LoaiKhoiKienThucResponse {
  id?: number;

  @ApiProperty({ type: KhoiKienThucResponse })
  khoiKienThuc?: KhoiKienThucResponse;

  @ApiProperty()
  maLoaiKhoiKienThuc?: string;

  @ApiProperty()
  ten?: string;

  @ApiProperty()
  tongTinChi?: number;

  @ApiProperty()
  noidung?: string;

  @ApiProperty({ type: UserResponse })
  createdBy?: UserResponse;

  @ApiProperty({ type: UserResponse })
  updatedBy?: UserResponse;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  isDeleted?: boolean;
}
