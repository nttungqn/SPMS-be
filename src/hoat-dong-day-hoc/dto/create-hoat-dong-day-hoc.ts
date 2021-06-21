import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Column } from 'typeorm';

export class CreateHoatDongDayHocDTO {
  @ApiProperty()
  @Column({ name: 'ma' })
  @IsOptional()
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsNotEmpty()
  // // @Length(5)
  ten: string;
}
