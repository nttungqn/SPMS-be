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

export class FilterGomNhom extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Tieu De ' })
  @IsOptional()
  readonly search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly idLKKT: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly maGN: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly loaiNhom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  readonly soTCBB: number;

  @ApiProperty({
    required: false,
    description: 'Sort by column: id, idLKKT.ten, maGN, loaiNhom, stt, tieuDe, soTCBB, updatedAt, createdAt'
  })
  @IsIn(['id', 'idLKKT.ten', 'maGN', 'loaiNhom', 'stt', 'tieuDe', 'soTCBB', 'updatedAt', 'createdAt'])
  @IsOptional()
  readonly sortBy?: 'id' | 'idLKKT.ten' | 'maGN' | 'loaiNhom' | 'stt' | 'tieuDe' | 'soTCBB' | 'updatedAt' | 'createdAt';

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
