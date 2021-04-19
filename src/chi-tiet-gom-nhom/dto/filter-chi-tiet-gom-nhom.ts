import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  readonly page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number;
}

export class FilterChiTietGomNhom extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Tieu De ' })
  @IsOptional()
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idMH: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idGN: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly ghiChu: string;

  @ApiProperty({
    required: false,
    description: "Sort by column: 'monHoc.tenTiengViet', 'gomNhom.tieuDe', 'ghiChu'"
  })
  @IsIn(['id', 'monHoc.tenTiengViet', 'gomNhom.tieuDe', 'ghiChu'])
  @IsOptional()
  readonly sortBy?: 'id' | 'monHoc.tenTiengViet' | 'gomNhom.tieuDe' | 'ghiChu';

  @ApiProperty({ required: false, description: 'Sort by type: ASC, DESC' })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  readonly sortType?: 'ASC' | 'DESC';
}

export class DeleteMultipleRows {
  @ApiProperty({ required: true, description: 'Delete multiple ids: ids=1,2,3,..' })
  @IsString()
  readonly ids?: string;
}
