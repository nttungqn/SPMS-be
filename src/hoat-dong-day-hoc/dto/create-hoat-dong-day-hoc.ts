import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class CreateHoatDongDayHocDTO {
  @ApiProperty()
  @Column({ name: 'ma' })
  @IsOptional()
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsOptional()
  ten: string;
}
