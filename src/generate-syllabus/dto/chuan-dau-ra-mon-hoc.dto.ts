import { ApiProperty } from '@nestjs/swagger';
import { CreateChuanDauRaMonHocDto } from 'chuan-dau-ra-mon-hoc/dto/create-chuan-dau-ra-mon-hoc.dto';
import { IsNumber } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class ChuanDauRaMonHocCustom extends CreateChuanDauRaMonHocDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id?: number;
}
