import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional } from 'class-validator';

export class FilterChuanDauRaMonHocDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idMucTieuMonHoc: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idSyllabus: number;
}
