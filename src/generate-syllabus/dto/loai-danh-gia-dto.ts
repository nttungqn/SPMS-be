import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateLoaiDanhGiaDto } from 'loai-danh-gia/dto/create-loai-danh-gia.dto';
import { Entity } from 'typeorm';

@Entity()
export class LoaiDanhGiaCustom extends CreateLoaiDanhGiaDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id?: number;
}
