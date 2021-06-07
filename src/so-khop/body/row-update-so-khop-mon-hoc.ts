import { ApiProperty } from '@nestjs/swagger';

export class RowUpdateSoKhoMH {
  @ApiProperty()
  idChiTietGomNhom: number;
  @ApiProperty()
  idChiTietMonHocTrc: number;
}
