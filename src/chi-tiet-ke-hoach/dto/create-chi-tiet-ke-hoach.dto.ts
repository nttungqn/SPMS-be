import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, Min } from 'class-validator';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateChiTietKeHoachDto {
  @ApiProperty()
  @ManyToOne(() => KeHoachGiangDayEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_KeHoachGiangDay' })
  @Column({ name: 'ID_KeHoachGiangDay' })
  @IsNotEmpty()
  @Min(1)
  idKHGD?: number;

  @ApiProperty()
  @ManyToOne(() => ChiTietGomNhomEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_ChiTietGomNhom' })
  @Column({ name: 'ID_ChiTietGomNhom' })
  @IsNotEmpty()
  @Min(1)
  idCTGN?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  @IsOptional()
  ghiChu?: number;
}
