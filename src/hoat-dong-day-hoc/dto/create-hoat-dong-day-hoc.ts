import { ApiProperty } from '@nestjs/swagger';
import { ChuDeEntity } from 'chu-de/entity/chu-de.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateHoatDongDayHocDTO {
  @ApiProperty()
  @ManyToOne(() => ChuDeEntity)
  @JoinColumn({ name: 'idCD' })
  @Column({ name: 'idCD' })
  idCD: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  ten: string;

  @ApiProperty()
  @Column({ name: 'stt' })
  stt: number;
}
