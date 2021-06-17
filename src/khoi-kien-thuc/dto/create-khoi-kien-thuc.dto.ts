import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { IsInt, IsNotEmpty, IsOptional, Length, Min, minLength } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateKhoiKienThucDto {
  @ApiProperty()
  @Column({ name: 'ID_ChiTietNganhDaoTao' })
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_ChiTietNganhDaoTao' })
  @IsNotEmpty()
  chiTietNganh?: number;

  @ApiProperty()
  @Column({ name: 'MaKTT', default: null })
  @IsOptional()
  maKKT?: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  @IsNotEmpty()
  @Length(5)
  ten?: string;

  @ApiProperty()
  @Column({ name: 'TinChiTuChon', default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  tinChiTuChon?: number;

  @ApiProperty()
  @Column({ name: 'TCBatBuoc', default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  tinChiBatBuoc?: number;

  @ApiProperty()
  @Column({ name: 'TCTuChonTuDo', default: 0 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  tinChiTuChonTuDo?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  @IsOptional()
  ghiChu?: string;
}
