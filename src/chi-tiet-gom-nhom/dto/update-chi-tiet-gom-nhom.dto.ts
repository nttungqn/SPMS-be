import { PartialType } from '@nestjs/mapped-types';
import { CreateChiTietGomNhomDTO } from './create-chi-tiet-gom-nhom.dto';

export class UpdateChiTietGomNhomDTO extends PartialType(CreateChiTietGomNhomDTO) {}
