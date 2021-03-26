import { PartialType } from '@nestjs/mapped-types';
import { CreateHoatDongDanhGiaDto } from './create-hoat-dong-danh-gia.dto';

export class UpdateHoatDongDanhGiaDto extends PartialType(CreateHoatDongDanhGiaDto) {}
