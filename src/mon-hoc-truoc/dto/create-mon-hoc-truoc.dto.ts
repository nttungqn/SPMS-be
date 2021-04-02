import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateMonHocTruocDto {
  @ApiProperty()
  @IsNumberString()
  idMonHoc: number;

  @ApiProperty()
  @IsNumberString()
  idMonHocTruoc: number;

  @ApiProperty({ description: 'Id chi tiết ngành đào tạo của môn học trước' })
  @IsNumberString()
  idChiTietNganhDaoTao: number;

  @ApiProperty({ description: 'Id chi tiết gom nhóm ' })
  @IsNumberString()
  idChiTietGomNhom: number;
}
