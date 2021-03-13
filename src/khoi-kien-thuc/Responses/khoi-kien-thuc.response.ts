import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoDto } from 'chi-tiet-nganh-dao-tao/interfaces/chiTietNganhDaoTao.response';
import { UserResponse } from 'users/Responses/user.response';

export class KhoiKienThucResponse {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  chiTietNganh?: ChiTietNganhDaoTaoDto;

  @ApiProperty()
  maKKT?: string;

  @ApiProperty()
  ten?: string;

  @ApiProperty()
  tinChiTuChon?: number;

  @ApiProperty()
  tinChiBatBuoc?: number;

  @ApiProperty()
  tinChiTuChonTuDo?: number;

  @ApiProperty()
  ghiChu?: string;

  @ApiProperty()
  tongTinChi?: number;

  @ApiProperty({ type: UserResponse })
  updatedBy?: UserResponse;

  @ApiProperty({ type: UserResponse })
  createdBy?: UserResponse;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  isDeleted?: boolean;
}
