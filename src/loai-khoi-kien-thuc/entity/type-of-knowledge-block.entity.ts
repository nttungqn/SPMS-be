import { TABLE_NAME } from 'constant/constant';
import { CreateLoaiKhoiKienThucDto } from 'loai-khoi-kien-thuc/dto/create-loai-khoi-kien-thuc.dto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.LOAIKHOIKIENTHUC)
export class LoaiKhoiKienThucEntity extends CreateLoaiKhoiKienThucDto {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  readonly createdBy?: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  readonly updatedBy?: number;

  @Column({ name: 'updatedAt' })
  readonly updatedAt?: Date;

  @Column({ name: 'createdAt' })
  readonly createdAt?: Date;

  @Column({ name: 'isDeleted' })
  readonly isDeleted?: boolean;
}
