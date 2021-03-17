import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from 'users/Responses/user.response';

export class ChuanDauRaMonHocResponse {
  @ApiProperty()
  id?: number;
  @ApiProperty()
  ma?: string;
  @ApiProperty()
  mucTieuMonHoc?: number;
  @ApiProperty()
  mota?: string;
  @ApiProperty()
  mucDo?: string;
  @ApiProperty({ type: UserResponse })
  createdBy?: UserResponse;
  @ApiProperty({ type: UserResponse })
  updatedBy?: UserResponse;
  @ApiProperty()
  createdAt?: Date;
  @ApiProperty()
  updatedAt?: Date;
  @ApiProperty()
  isDeleted?: boolean;
}
