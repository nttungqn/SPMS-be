import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterLoaiDanhGia extends BaseFilterDto {
  @ApiProperty({ required: false })
  idSyllabus: number;
}
