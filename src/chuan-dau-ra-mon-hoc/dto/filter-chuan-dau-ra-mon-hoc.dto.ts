import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from 'chuong-trinh-dao-tao/dto/filterChuongTrinhDaoTao.dto';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class FilterChuanDauRaMonHocDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idMucTieuMonHoc: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  idSyllabus: number;

  @ApiProperty({ required: false, description: ' this field search by mota , ma ,mucDo' })
  @IsOptional()
  readonly searchKey?: string;

  @ApiProperty({
    required: false,
    description: 'Sort a string in column: ma, mucTieuMonHoc, mota, mucDo, updatedAt, createdAt, updatedBy, createdBy'
  })
  @IsOptional()
  @IsIn(['ma', 'mucTieuMonHoc', 'mota', 'mucDo', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy'])
  sortBy: 'ma' | 'mucTieuMonHoc' | 'mota' | 'mucDo' | 'updatedAt' | 'createdAt' | 'updatedBy' | 'createdBy';

  @ApiProperty({ required: false, description: 'ASC| DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortType: 'ASC' | 'DESC';
}
