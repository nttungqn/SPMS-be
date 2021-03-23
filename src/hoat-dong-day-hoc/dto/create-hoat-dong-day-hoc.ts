import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateHoatDongDayHocDTO {
  @ApiProperty()
  @Column({ name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;
}
