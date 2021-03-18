import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateLoaiKeHoachGiangDayDto {
  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;
}
