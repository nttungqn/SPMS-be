import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsString, IsNumberString, IsOptional, IsIn } from 'class-validator';

export class FilterChuanDauRaDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'trường này dùng để search theo tên' })
  @IsString()
  @IsOptional()
  readonly search: string;

  @ApiProperty({ required: false, description: 'mức độ' })
  @IsNumberString()
  @IsOptional()
  readonly mucDo: number;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType?: 'ASC' | 'DESC';
}
