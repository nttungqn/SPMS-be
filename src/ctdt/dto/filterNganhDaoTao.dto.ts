import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterNganhDaoTaoDto extends BaseFilterDto {
  @ApiProperty({ required: false, example: 'phan mem' })
  readonly search: string;
}
