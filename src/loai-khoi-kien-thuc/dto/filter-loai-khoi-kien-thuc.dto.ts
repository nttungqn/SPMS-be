import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterLoaiKhoiKienThuc extends BaseFilterDto {
  @ApiProperty({ required: false })
  readonly idKhoiKienThuc?: number;
}
