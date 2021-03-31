import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class GetSyllabusFilterDto extends BaseFilterDto {
  @ApiProperty({ required: false, default: 'Tên của môn học' })
  @IsOptional()
  @IsNotEmpty()
  key?: string;

  createdBy?: number;

  @ApiProperty({ required: false, description: 'Sắp xếp tăng dần,giảm dần ASC | DESC ' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  updatedAt?: 'ASC' | 'DESC';
}
