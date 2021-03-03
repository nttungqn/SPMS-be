import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiKhoiKienThucDto } from './create-loai-khoi-kien-thuc.dto';

export class UpdateLoaiKhoiKienThucDto extends PartialType(CreateLoaiKhoiKienThucDto) {}
