import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: 'ChuanDauRaMonHoc' })
export class ChuanDauRaMonHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;
  @Column({ name: 'ma' })
  ma?: string;
  @Column({ name: 'idMTMH' })
  idMTMH?: number;
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
