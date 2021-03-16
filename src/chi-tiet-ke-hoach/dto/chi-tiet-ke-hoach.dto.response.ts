import { ApiProperty } from '@nestjs/swagger';
import { ChiTietKeHoachEntity } from '../entity/chi-tiet-ke-hoach.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllChiTietKeHoachDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [ChiTietKeHoachEntity] })
  readonly contents: ChiTietKeHoachEntity[];
}
