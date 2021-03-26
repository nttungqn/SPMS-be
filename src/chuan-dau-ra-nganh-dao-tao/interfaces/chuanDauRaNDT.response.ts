import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';

export class ChuanDauRaNDTDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ma: string;

  @ApiProperty()
  parent: number;

  @ApiProperty()
  nganhDaoTao: number;

  @ApiProperty()
  chuanDauRa: number;

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

export class ChuanDauRaNDTResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [ChuanDauRaNDTDto] })
  readonly contents: ChuanDauRaNDTDto[];
}
