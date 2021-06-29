import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsInt, IsNotEmpty, IsNumberString, isNumberString, IsOptional } from 'class-validator';

export class GetSyllabusFilterDto extends BaseFilterDto {
  @ApiProperty({ required: false, description: 'Tên của môn học' })
  @IsOptional()
  @IsNotEmpty()
  key?: string;

  @ApiProperty({ required: false, description: 'Id của môn học' })
  @IsOptional()
  @IsNumberString()
  idMonHoc: number;

  @ApiProperty({ required: false, description: 'Id năm học' })
  @IsOptional()
  @IsNumberString()
  idNamHoc: number;

  @ApiProperty({ required: false, description: 'Id hệ đào tạo' })
  @IsOptional()
  @IsNumberString()
  idHeDaotao: number;

  @ApiProperty({ required: false, description: 'Id chi tiết ngành đào tạo' })
  @IsOptional()
  @IsNumberString()
  idCTNDT: number;

  createdBy?: number;

  @ApiProperty({ required: false, description: 'Sắp xếp tăng dần,giảm dần ASC | DESC ' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  updatedAt?: 'ASC' | 'DESC';
}
