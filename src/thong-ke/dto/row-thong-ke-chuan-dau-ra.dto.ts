import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';

export class ThongKeChuanDauRaRow {
  mucTieuMonHoc: MucTieuMonHocEntity;
  chuanDauRaMonHoc: {
    cdrmh: ChuanDauRaMonHocEntity;
    count: number;
  }[] = [];
  count = 0;
}
