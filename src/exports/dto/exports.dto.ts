import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ExportsDto {
  @IsNumberString()
  @ApiProperty({ description: 'id của ngành đào tạo' })
  readonly nganhDaoTao: number;

  @IsNumberString()
  @ApiProperty({ description: 'khóa tuyển' })
  readonly khoa: number;
}
