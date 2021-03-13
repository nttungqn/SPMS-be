import { ApiProperty } from '@nestjs/swagger';
import { LoaiMonHoc } from 'mon-hoc-tien-quyet/enum/loai-mon-hoc.enum';
import { MonHocEntity } from 'mon-hoc/entity/monHoc.entity';
import { UserResponse } from 'users/Responses/user.response';

export class MonHocTienQuyetResponse {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: MonHocEntity })
  monHoc: MonHocEntity;

  @ApiProperty({ type: MonHocEntity })
  monHocTruoc: MonHocEntity;

  @ApiProperty()
  loaiMonHoc: LoaiMonHoc;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: UserResponse })
  createdBy: UserResponse;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponse })
  updatedBy: UserResponse;

  @ApiProperty()
  isDeleted: boolean;
}
