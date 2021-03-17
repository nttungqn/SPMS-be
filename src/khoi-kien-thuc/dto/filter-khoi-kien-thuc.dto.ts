import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsNumberString, IsOptional } from 'class-validator';

export class filterKnowledgeBlock extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  idChiTietNganhDaoTao: number;
}
