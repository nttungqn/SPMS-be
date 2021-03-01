import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetSyllabusFilterDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
