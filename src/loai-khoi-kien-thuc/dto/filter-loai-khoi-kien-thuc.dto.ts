import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsOptional } from 'class-validator';

export class FilterLoaiKhoiKienThuc extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly idKhoiKienThuc?: number;

  @ApiProperty({ required: false, description: 'Sắp xếp tăng dần,giảm dần (ASC | DESC) theo thời gian tạo' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  createdAt?: 'ASC' | 'DESC';
}
