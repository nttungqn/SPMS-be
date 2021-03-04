import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsString } from 'class-validator';

export class FilterChuanDauRaDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'this field search by Ten' })
  @IsString()
  readonly search: string;

  @ApiProperty({ required: false })
  @IsInt()
  readonly mucDo: number;
}
