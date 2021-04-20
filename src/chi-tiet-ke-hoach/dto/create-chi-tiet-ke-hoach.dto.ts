import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateChiTietKeHoachDto {
  @ApiProperty()
  @ManyToOne(() => KeHoachGiangDayEntity)
  @JoinColumn({ name: 'ID_KeHoachGiangDay' })
  @Column({ name: 'ID_KeHoachGiangDay' })
  @IsNotEmpty()
  idKHGD?: number;

  @ApiProperty()
  @ManyToOne(() => ChiTietGomNhomEntity)
  @JoinColumn({ name: 'ID_ChiTietGomNhom' })
  @Column({ name: 'ID_ChiTietGomNhom' })
  @IsNotEmpty()
  idCTGN?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  @IsOptional()
  ghiChu?: number;
}
