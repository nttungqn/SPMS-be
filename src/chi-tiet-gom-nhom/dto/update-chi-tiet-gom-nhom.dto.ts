import { PartialType } from '@nestjs/swagger';
import { CreateChiTietGomNhomDTO } from './create-chi-tiet-gom-nhom.dto';

export class UpdateChiTietGomNhomDTO extends PartialType(CreateChiTietGomNhomDTO) {}
