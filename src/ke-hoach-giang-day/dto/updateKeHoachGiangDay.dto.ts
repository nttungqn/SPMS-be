import { PartialType } from '@nestjs/swagger';
import { CreateKeHoachGiangDayDto } from './createKeHoachGiangDay.dto';

export class UpdateKeHoachGiangDayDto extends PartialType(CreateKeHoachGiangDayDto) {}
