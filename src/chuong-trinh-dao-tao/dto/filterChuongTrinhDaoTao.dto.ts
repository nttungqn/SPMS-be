import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0, description: 'số trang muốn lấy' })
  @IsOptional()
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'số lượng dòng data muốn lấy' })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number;
}

export class FilterChuongTrinhDaoTao extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'trường này dùng để search theo tên' })
  @IsOptional()
  readonly search?: string;
  @ApiProperty({ required: false, description: 'mã chương trình đào tạo' })
  @IsOptional()
  readonly maCTDT?: string;

  @ApiProperty({ required: false, description: 'sort theo ASC hay DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  updatedAt: 'ASC' | 'DESC';
}
