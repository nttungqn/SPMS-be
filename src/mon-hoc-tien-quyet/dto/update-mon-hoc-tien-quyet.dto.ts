import { PartialType } from '@nestjs/mapped-types';
import { CreateMonHocTienQuyetDto } from './create-mon-hoc-tien-quyet.dto';

export class UpdateMonHocKienQuyetDto extends PartialType(CreateMonHocTienQuyetDto) {}
