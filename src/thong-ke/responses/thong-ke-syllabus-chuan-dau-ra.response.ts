import { ApiProperty } from '@nestjs/swagger';
import { ThongKeChuanDauRaRow } from 'thong-ke/dto/row-thong-ke-chuan-dau-ra.dto';

export class ThongKeSyllabusChuanDauRa {
  @ApiProperty({ type: [ThongKeChuanDauRaRow] })
  contents: ThongKeChuanDauRaRow[];
  @ApiProperty()
  total: number;
}
