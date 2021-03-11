import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';

export class ChuanDauTaDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ten: string;
  @ApiProperty()
  mucDo: number;

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
export class ChuanDauRaResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [ChuanDauTaDto] })
  readonly contents: ChuanDauTaDto[];
}
