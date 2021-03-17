import { PartialType } from '@nestjs/mapped-types';
import { CreateChuanDauRaMonHocDto } from './create-chuan-dau-ra-mon-hoc.dto';

export class UpdateChuanDauRaMonHocDto extends PartialType(CreateChuanDauRaMonHocDto) {}
