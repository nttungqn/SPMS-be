import { PartialType } from '@nestjs/mapped-types';
import { CreateKhoiKienThucDto } from './create-khoi-kien-thuc.dto';

export class UpdateKhoiKienThucDto extends PartialType(CreateKhoiKienThucDto) {}
