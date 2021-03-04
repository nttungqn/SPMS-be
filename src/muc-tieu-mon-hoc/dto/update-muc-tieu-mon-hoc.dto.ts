import { PartialType } from '@nestjs/mapped-types';
import { CreateMucTieuMonHocDto } from './create-muc-tieu-mon-hoc.dto';

export class UpdateMucTieuMonHocDto extends PartialType(CreateMucTieuMonHocDto) {}
