import { ApiProperty } from '@nestjs/swagger';
import { HeDaoTaoResponse } from 'he-dao-tao/Responses/he-dao-tao.response';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { NamHocResponse } from 'nam-hoc/Responses/nam-hoc.respones';
import { UserResponse } from 'users/Responses/user.response';

export class SyllabusResponse {
  @ApiProperty()
  id?: number;

  @ApiProperty({ type: MonHocEntity })
  monHoc?: MonHocEntity;

  @ApiProperty({ type: HeDaoTaoResponse })
  heDaoTao?: HeDaoTaoResponse;

  @ApiProperty({ type: NamHocResponse })
  namHoc?: NamHocResponse;

  @ApiProperty()
  taiNguyen?: string;

  @ApiProperty()
  quiDinh?: string;

  @ApiProperty()
  moTa?: string;

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
