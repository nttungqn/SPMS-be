import { ApiProperty } from '@nestjs/swagger';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';

export class RowSoKhopNganhDaoTao {
  @ApiProperty({ type: MonHocEntity })
  first: MonHocEntity;
  @ApiProperty({ type: [MonHocEntity] })
  second: MonHocEntity[];
}
