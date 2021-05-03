import { TABLE_NAME } from 'constant/constant';
import { CreateKhoiKienThucDto } from 'khoi-kien-thuc/dto/create-khoi-kien-thuc.dto';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.KHOIKIENTHUC })
export class KhoiKienThucEntity extends CreateKhoiKienThucDto {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id?: number;
  @Column({ name: 'TongTC' })
  tongTinChi?: number;

  @OneToMany(() => LoaiKhoiKienThucEntity, (lkkt) => lkkt.khoiKienThuc, { onDelete: 'CASCADE' })
  loaiKhoiKienThuc?: LoaiKhoiKienThucEntity[];

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
