import { ApiProperty } from '@nestjs/swagger';
import { GomNhomEntity } from '../entity/gom-nhom.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllGomNhomDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [GomNhomEntity] })
  readonly contents: GomNhomEntity[];
}
