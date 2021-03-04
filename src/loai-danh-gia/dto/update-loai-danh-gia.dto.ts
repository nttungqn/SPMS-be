import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiDanhGiaDto } from './create-loai-danh-gia.dto';

export class UpdateLoaiDanhGiaDto extends PartialType(CreateLoaiDanhGiaDto) {}
