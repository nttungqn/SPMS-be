import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaMonHocResponse } from 'chuan-dau-ra-mon-hoc/responses/chuan-dau-ra-mon-hoc.response';
import { HoatDongDanhGiaResponse } from 'hoat-dong-danh-gia/response/hoat-dong-danh-gia.response';
import { SyllabusResponse } from 'syllabus/Responses/syllbus.response';
import { UserResponse } from 'users/Responses/user.response';

export class LoaiDanhGiaResponse {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  syllabus?: number;

  @ApiProperty()
  ma?: string;

  @ApiProperty()
  ten?: string;

  @ApiProperty()
  tyLe?: number;

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

  @ApiProperty({ type: [ChuanDauRaMonHocResponse] })
  chuanDauRaMonHoc: ChuanDauRaMonHocResponse[];

  @ApiProperty({ type: [HoatDongDanhGiaResponse] })
  hoatDongDanhGia: HoatDongDanhGiaResponse[];
}
