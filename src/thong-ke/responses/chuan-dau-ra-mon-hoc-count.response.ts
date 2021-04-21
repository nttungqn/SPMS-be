import { ApiProperty } from '@nestjs/swagger';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { ChuanDauRaMonHocResponse } from 'chuan-dau-ra-mon-hoc/responses/chuan-dau-ra-mon-hoc.response';

export class ChuanDauRaMonHocCountRes {
  @ApiProperty({ type: ChuanDauRaMonHocResponse })
  cdrmh: ChuanDauRaMonHocEntity;
  @ApiProperty()
  count: number;
}
