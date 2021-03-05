import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetSyllabusFilterDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  updatedAt: 'ASC' | 'DESC';
}
