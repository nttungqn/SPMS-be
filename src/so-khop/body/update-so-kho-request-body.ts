import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RowUpdateSoKhoMH } from './row-update-so-khop-mon-hoc';

export class UpdateSoKhopRequestBody {
  @ApiProperty()
  @IsNotEmpty()
  khoaTuyenNam1: number;
  @ApiProperty()
  @IsNotEmpty()
  khoaTuyenNam2: number;
  @ApiProperty({ type: [RowUpdateSoKhoMH] })
  @IsNotEmpty()
  contents: RowUpdateSoKhoMH[];
}
