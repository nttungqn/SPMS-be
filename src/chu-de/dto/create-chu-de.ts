import { ApiProperty } from '@nestjs/swagger';
import { LoaiKeHoachGiangDayEntity } from 'loai-ke-hoach-giang-day/entity/loaiKeHoachGiangDay.entity';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateChuDeDTO {
  @ApiProperty()
  @ManyToOne(() => Syllabus)
  @JoinColumn({ name: 'idSyllabus' })
  @Column({ name: 'idSyllabus' })
  idSyllabus: number;

  @ApiProperty()
  @ManyToOne(() => LoaiKeHoachGiangDayEntity)
  @JoinColumn({ name: 'idLKHGD' })
  @Column({ name: 'idLKHGD' })
  idLKHGD: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;

  @ApiProperty()
  @Column({ name: 'tuan' })
  tuan: number;
}
