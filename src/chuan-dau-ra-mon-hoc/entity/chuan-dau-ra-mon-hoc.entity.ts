import { TABLE_NAME } from 'constant/constant';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.CHUANDAURAMONHOC })
export class ChuanDauRaMonHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;
  @Column({ name: 'ma' })
  ma?: string;

  @Column({ name: 'idMTMH' })
  @ManyToOne(() => MucTieuMonHocEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idMTMH', referencedColumnName: 'id' })
  mucTieuMonHoc?: number;

  @Column({ name: 'moTa' })
  mota?: string;
  @Column({ name: 'mucDo' })
  mucDo?: string;

  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
