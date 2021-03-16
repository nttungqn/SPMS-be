import { PartialType } from '@nestjs/mapped-types';
import { CreateLoaiKeHoachGiangDayDto } from './createLoaiKeHoachGiangDay.dto';

export class UpdateLoaiKeHoachGiangDayDto extends PartialType(CreateLoaiKeHoachGiangDayDto) {}
