import { ApiProperty } from '@nestjs/swagger';
import { LoaiKeHoachGiangDayEntity } from 'loai-ke-hoach-giang-day/entity/loaiKeHoachGiangDay.entity';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateChuDeDTO {}
