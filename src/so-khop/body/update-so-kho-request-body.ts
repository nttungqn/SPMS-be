import { ApiProperty } from '@nestjs/swagger';
import { RowUpdateSoKhoMH } from './row-update-so-khop-mon-hoc';

export class UpdateSoKhopRequestBody {
  @ApiProperty()
  khoaTuyenNam1: number;
  @ApiProperty()
  khoaTuyenNam2: number;
  @ApiProperty({ type: [RowUpdateSoKhoMH] })
  contents: RowUpdateSoKhoMH[];
}
