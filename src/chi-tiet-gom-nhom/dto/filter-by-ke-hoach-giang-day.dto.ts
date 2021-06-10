import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterByKeHoachGiangDay extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly searchKey?: string;
}
