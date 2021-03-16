import { ApiProperty } from '@nestjs/swagger';
import { SyllabusResponse } from 'syllabus/Responses/syllbus.response';
import { UserResponse } from 'users/Responses/user.response';

export class MucTieuMonHocResponse {
  @ApiProperty()
  id?: number;

  @ApiProperty({ type: SyllabusResponse })
  syllabus?: SyllabusResponse;

  @ApiProperty()
  ma?: string;

  @ApiProperty()
  moTa?: string;

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
