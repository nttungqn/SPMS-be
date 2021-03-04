import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString } from 'class-validator';

export class FilterLoaiDanhGia extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  idSyllabus: number;
}
