import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsOptional } from 'class-validator';

export class FilterPermission extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search name resource' })
  @IsOptional()
  readonly searchKey?: string;
}
