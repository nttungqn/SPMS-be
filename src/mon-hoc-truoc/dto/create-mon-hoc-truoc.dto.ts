import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMonHocTruocDto {
  @ApiProperty({ description: 'id chi tiết gom nhóm môn học' })
  @IsInt()
  idCTGNMonHoc: number;

  @ApiProperty({ description: 'id chi tiết gom nhóm môn học trước' })
  @IsInt()
  idCTGNMonHocTruoc: number;
}
