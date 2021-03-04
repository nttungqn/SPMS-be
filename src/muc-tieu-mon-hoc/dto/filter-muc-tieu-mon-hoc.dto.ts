import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterMucTieuMonHoc extends BaseFilterDto {
  @ApiProperty({ required: false })
  idSyllabus: number;
}
