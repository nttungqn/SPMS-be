import { ApiProperty } from '@nestjs/swagger';
import { HoatDongDayHocEntity } from '../entity/hoat-dong-day-hoc.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllChiTietGomNhomDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [HoatDongDayHocEntity] })
  readonly contents: HoatDongDayHocEntity[];
}
