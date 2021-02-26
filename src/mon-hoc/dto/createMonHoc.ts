import { ApiProperty } from '@nestjs/swagger';

export class CreateMonHocDto {
  @ApiProperty({ required: true })
  readonly IDKTT?: number;

  @ApiProperty({ required: false })
  readonly Ma?: string;

  @ApiProperty({ required: false })
  readonly TenTiengViet?: string;

  @ApiProperty({ required: false })
  readonly TenTiengAnh?: string;

  @ApiProperty({ required: false })
  readonly SoTinChi?: number;

  @ApiProperty({ required: false })
  readonly SoTietThucHanh?: number;

  @ApiProperty({ required: false })
  readonly SoTietTuHoc?: number;

  @ApiProperty({ required: false, example: 0 })
  readonly TongTinChi?: number;

  @ApiProperty({ required: false })
  readonly MoTa?: string;
}
