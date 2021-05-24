import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateHoatDongDayHocDTO } from 'hoat-dong-day-hoc/dto/create-hoat-dong-day-hoc';
import { Entity } from 'typeorm';

@Entity()
export class HoatDongDayHocCustom extends CreateHoatDongDayHocDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  id?: number;
}
