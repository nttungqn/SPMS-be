import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { KnowledgeBlock } from 'knowledge-block/entity/knowledge-block.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class CreateTypeOfKnowledgeBlockDto {
  //@Column({name:'ID_KhoiKienThuc'})
  @ApiProperty()
  @IsNotEmpty()
  @ManyToOne(() => KnowledgeBlock)
  @JoinColumn({ name: 'ID_KhoiKienThuc' })
  khoiKienThuc?: number;

  @ApiProperty()
  @Column({ name: 'Ma_LoaiKhoiKT' })
  @IsNotEmpty()
  maLoaiKhoiKienThuc?: string;

  @ApiProperty()
  @Column({ name: 'Ten' })
  @IsNotEmpty()
  ten?: string;

  @ApiProperty()
  @Column({ name: 'TongTC' })
  @IsNotEmpty()
  tongTinChi?: number;

  @ApiProperty()
  @Column({ name: 'NoiDung' })
  noidung?: string;
}
