import { ApiProperty } from '@nestjs/swagger';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateKhoiKienThucDto {
  @ApiProperty()
  @Column({ name: 'ID_ChiTietNganhDaoTao' })
  @ManyToOne(() => ChiTietNganhDaoTaoEntity, (ctndt) => ctndt.khoiKienThucList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_ChiTietNganhDaoTao' })
  @IsNotEmpty()
  chiTietNganh?: number;

  @ApiProperty()
  @Column({ name: 'MaKTT' })
  @IsNotEmpty()
  maKKT?: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  @IsNotEmpty()
  ten?: string;

  @ApiProperty()
  @Column({ name: 'TinChiTuChon', default: 0 })
  @IsInt()
  @IsOptional()
  tinChiTuChon?: number;

  @ApiProperty()
  @Column({ name: 'TCBatBuoc', default: 0 })
  @IsInt()
  @IsOptional()
  tinChiBatBuoc?: number;

  @ApiProperty()
  @Column({ name: 'TCTuChonTuDo', default: 0 })
  @IsInt()
  @IsOptional()
  tinChiTuChonTuDo?: number;

  @ApiProperty()
  @Column({ name: 'GhiChu' })
  @IsOptional()
  ghiChu?: string;
}
