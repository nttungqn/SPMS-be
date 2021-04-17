import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { MucTieuMonHocResponse } from 'muc-tieu-mon-hoc/Responses/muc-tieu-mon-hoc.response';
import { ChuanDauRaMonHocCountRes } from 'thong-ke/responses/chuan-dau-ra-mon-hoc-count.response';

export class ThongKeChuanDauRaRow {
  @ApiProperty({ type: MucTieuMonHocResponse })
  mucTieuMonHoc: MucTieuMonHocEntity;
  @ApiProperty({ type: [ChuanDauRaMonHocCountRes] })
  chuanDauRaMonHoc: {
    cdrmh: ChuanDauRaMonHocEntity;
    count: number;
  }[] = [];
  @ApiProperty()
  count = 0;
}
