import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { UserResponse } from 'users/Responses/user.response';

export class MucTieuMonHocResponse {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  syllabus?: number;

  @ApiProperty()
  ma?: string;

  @ApiProperty()
  moTa?: string;

  @ApiProperty({ type: [ChuanDauRaNganhDaoTaoEntity] })
  chuanDauRaCDIO?: ChuanDauRaNganhDaoTaoEntity[];

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
