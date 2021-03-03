import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional } from 'class-validator';
import { LoaiMonHoc } from 'mon-hoc-tien-quyet/enum/loai-mon-hoc.enum';

export class FilterMonHocKienQuyet extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  type: LoaiMonHoc;
}
