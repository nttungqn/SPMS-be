import { TABLE_NAME } from 'constant/constant';
import { GomNhomEntity } from 'gom-nhom/entity/gom-nhom.entity';
import { CreateLoaiKhoiKienThucDto } from 'loai-khoi-kien-thuc/dto/create-loai-khoi-kien-thuc.dto';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.LOAIKHOIKIENTHUC)
export class LoaiKhoiKienThucEntity extends CreateLoaiKhoiKienThucDto {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id?: number;

  @OneToMany(() => GomNhomEntity, (gomNhom) => gomNhom.loaiKhoiKienThuc, { onDelete: 'CASCADE', cascade: ['insert'] })
  @JoinColumn({ name: 'ID' })
  gomNhom?: GomNhomEntity[];

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @Column({ name: 'updatedAt' })
  readonly updatedAt?: Date;

  @Column({ name: 'createdAt' })
  readonly createdAt?: Date;

  @Column({ name: 'isDeleted' })
  readonly isDeleted?: boolean;
}
