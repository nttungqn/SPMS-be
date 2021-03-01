import { CreateKnowledgeBlockDto } from 'knowledge-block/dto/create-knowledge-block.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'KhoiKienThuc' })
export class KnowledgeBlock extends CreateKnowledgeBlockDto {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id?: number;
  @Column({ name: 'TongTC' })
  tongTinChi?: number;

  @Column({ name: 'updatedBy' })
  updatedBy?: number;
  @Column({ name: 'createdBy' })
  createdBy?: number;
  @Column({ name: 'updatedAt' })
  updatedAt?: Date;
  @Column({ name: 'createdAt' })
  createdAt?: Date;
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
