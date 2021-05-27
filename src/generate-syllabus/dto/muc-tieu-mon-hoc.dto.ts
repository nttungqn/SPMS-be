import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateMucTieuMonHocDto } from 'muc-tieu-mon-hoc/dto/create-muc-tieu-mon-hoc.dto';
import { Entity } from 'typeorm';

@Entity()
export class MucTieuMonHocCustom extends CreateMucTieuMonHocDto {
  @ApiProperty({ required: true })
  @IsNumber()
  id?: number;
}
