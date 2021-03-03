import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';

export class FilterChuanDauRaDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'this field search by Ten' })
  readonly search: string;

  @ApiProperty({ required: false })
  readonly mucDo: number;
}
