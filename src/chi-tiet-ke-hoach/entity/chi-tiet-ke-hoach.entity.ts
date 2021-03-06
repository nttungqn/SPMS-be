import { TABLE_NAME } from 'constant/constant';
import { CreateChiTietKeHoachDto } from 'chi-tiet-ke-hoach/dto/create-chi-tiet-ke-hoach.dto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.CHITIETKEHOACH })
export class ChiTIetKeHoachEntity extends CreateChiTietKeHoachDto {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

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
