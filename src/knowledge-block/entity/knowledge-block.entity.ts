import { TABLE_NAME } from 'constant/constant';
import { CreateKnowledgeBlockDto } from 'knowledge-block/dto/create-knowledge-block.dto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.KHOIKIENTHUC })
export class KnowledgeBlock extends CreateKnowledgeBlockDto {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id?: number;
  @Column({ name: 'TongTC' })
  tongTinChi?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;
  @Column({ name: 'createdAt' })
  createdAt?: Date;
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
