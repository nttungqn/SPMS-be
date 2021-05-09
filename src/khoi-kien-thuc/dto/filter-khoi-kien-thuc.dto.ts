import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class filterKnowledgeBlock extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  idChiTietNganhDaoTao: number;

  @ApiProperty({
    required: false,
    description: 'Search by id, tongTinChi, ten, maKKT, tinChiTuChon, tinChiTuChonTuDo,tinChiBatBuoc'
  })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description:
      'Sort by: id, tongTinChi, ten, maKKT,tinChiTuChon, tinChiTuChonTuDo,tinChiBatBuoc,createdAt, updatedAt, property chiTietNganh'
  })
  @IsOptional()
  readonly sortBy?: string;

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sortType?: 'ASC' | 'DESC';
}
