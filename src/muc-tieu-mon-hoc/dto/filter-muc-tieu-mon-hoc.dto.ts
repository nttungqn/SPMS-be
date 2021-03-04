import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsInt, IsNumberString } from 'class-validator';

export class FilterMucTieuMonHoc extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  idSyllabus: number;
}
