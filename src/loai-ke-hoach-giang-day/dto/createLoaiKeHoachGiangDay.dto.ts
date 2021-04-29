import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateLoaiKeHoachGiangDayDto {
  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  @IsString()
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsString()
  ten: string;
}
