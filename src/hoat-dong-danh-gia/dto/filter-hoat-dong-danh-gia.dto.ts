import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional } from 'class-validator';

export class FilterHoatDongDanhGia extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idLoaiDanhGia: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idSyllabus: number;
}
