import { PartialType } from '@nestjs/mapped-types';
import { CreateMonHocTruocDto } from './create-mon-hoc-truoc.dto';

export class UpdateMonHocTruocDto extends PartialType(CreateMonHocTruocDto) {}
