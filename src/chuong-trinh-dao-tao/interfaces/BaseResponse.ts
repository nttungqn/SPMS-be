import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'số lượng dòng data muốn lấy' })
  readonly limit?: number;
}
