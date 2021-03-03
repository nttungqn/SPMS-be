import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { TypeOfKnowledgeBlock } from 'type-of-knowledge-block/entity/type-of-knowledge-block.entity';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';

@Entity(TABLE_NAME.GOMNHOM)
export class GomNhomEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @ManyToOne(() => TypeOfKnowledgeBlock)
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  @Column({ name: 'ID_LoaiKhoiKienThuc' })
  idLKKT: number;

  @ApiProperty()
  @Column({ name: 'Ma_GomNhom' })
  maGN: number;

  @ApiProperty()
  @Column({ name: 'TieuDe' })
  tieuDe: string;

  @ApiProperty()
  @Column({ name: 'STT' })
  stt: number;

  @ApiProperty()
  @Column({ name: 'LoaiNhom' })
  loaiNhom: string;

  @ApiProperty()
  @Column({ name: 'SoTCBB' })
  soTCBB: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
