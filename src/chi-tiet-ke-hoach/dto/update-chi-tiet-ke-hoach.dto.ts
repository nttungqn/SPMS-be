import { PartialType } from '@nestjs/mapped-types';
import { CreateChiTietKeHoachDto } from './create-chi-tiet-ke-hoach.dto';

export class UpdateChiTietKeHoachDto extends PartialType(CreateChiTietKeHoachDto) {}
