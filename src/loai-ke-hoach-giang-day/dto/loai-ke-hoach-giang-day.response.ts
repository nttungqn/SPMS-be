import { ApiProperty } from '@nestjs/swagger';
import { LoaiKeHoachGiangDayEntity } from '../entity/loaiKeHoachGiangDay.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllLoaiKeHoachGiangDayDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [LoaiKeHoachGiangDayEntity] })
  readonly contents: LoaiKeHoachGiangDayEntity[];
}
