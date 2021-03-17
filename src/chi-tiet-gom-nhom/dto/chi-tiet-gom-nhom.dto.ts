import { ApiProperty } from '@nestjs/swagger';
import { ChiTietGomNhomEntity } from '../entity/chi-tiet-gom-nhom.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllChiTietGomNhomDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [ChiTietGomNhomEntity] })
  readonly contents: ChiTietGomNhomEntity[];
}
