import { ApiProperty } from '@nestjs/swagger';
import { ChuDeEntity } from '../entity/chu-de.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllChuDeDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [ChuDeEntity] })
  readonly contents: ChuDeEntity[];
}
