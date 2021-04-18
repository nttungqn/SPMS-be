import { ApiProperty } from '@nestjs/swagger';
import { MonHocEntity } from '../entity/mon-hoc.entity';
export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllMonHocDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [MonHocEntity] })
  readonly contents: MonHocEntity[];
}
