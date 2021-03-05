import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Syllabus } from 'syllabus/entity/syllabus.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateLoaiDanhGiaDto {
  @ApiProperty()
  @ManyToOne(() => Syllabus)
  @JoinColumn({ name: 'idSyllabus' })
  @Column({ name: 'idSyllabus' })
  @IsNotEmpty()
  syllabus?: number;

  @ApiProperty()
  @Column({ name: 'ma' })
  @IsNotEmpty()
  ma?: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsNotEmpty()
  ten?: string;

  @ApiProperty()
  @Column({ name: 'tyLe' })
  @IsOptional()
  tyLe?: number;
}
