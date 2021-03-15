import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'chuong-trinh-dao-tao/interfaces/BaseResponse';
import { SyllabusResponse } from './syllbus.response';

export class FindAllSyllabusResponse extends BaseResponseDto {
  @ApiProperty({ type: [SyllabusResponse] })
  readonly contents: SyllabusResponse[];
}
