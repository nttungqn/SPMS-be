import { PartialType } from '@nestjs/mapped-types';
import { CreateHoatDongDayHocDTO } from './create-hoat-dong-day-hoc';

export class UpdateHoatDongDayHocDTO extends PartialType(CreateHoatDongDayHocDTO) {}
