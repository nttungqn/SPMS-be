import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateMonHocTruocDto {
  @ApiProperty()
  @IsNumberString()
  idMonHoc: number;

  @ApiProperty()
  @IsNumberString()
  idMonHocTruoc: number;

  @ApiProperty()
  @IsNumberString()
  idKhoaMonHoc: number;

  @ApiProperty()
  @IsNumberString()
  idKhoaMonHocTruoc: number;
}
