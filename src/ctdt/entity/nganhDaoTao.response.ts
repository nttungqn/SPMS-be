import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';

export class NganhDaoTaoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  maNganhDaoTao: string;

  @ApiProperty()
  ten: string;

  @ApiProperty()
  chuongTrinhDaoTao: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  updatedBy: number;

  @ApiProperty()
  isDeleted: boolean;
}

export class NganhDaoTaoResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [NganhDaoTaoDto] })
  readonly contents: NganhDaoTaoDto[];
}
