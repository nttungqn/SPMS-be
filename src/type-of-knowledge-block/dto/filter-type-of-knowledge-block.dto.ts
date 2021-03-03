import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterTypeOfKnowledgeBlock extends BaseFilterDto {
  @ApiProperty({ required: false })
  readonly idKhoiKienThuc?: number;
}
