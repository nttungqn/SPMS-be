import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateHoatDongDanhGiaDto } from 'hoat-dong-danh-gia/dto/create-hoat-dong-danh-gia.dto';
import { Entity } from 'typeorm';

@Entity()
export class HoatDongDanhGiaCustom extends CreateHoatDongDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsNumber()
  loaiDanhGia?: number;
}
