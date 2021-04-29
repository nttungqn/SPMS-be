import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from './../../users/entity/user.entity';
import { TABLE_NAME } from './../../constant/constant';
import { CreateLoaiKeHoachGiangDayDto } from 'loai-ke-hoach-giang-day/dto/createLoaiKeHoachGiangDay.dto';

@Entity(TABLE_NAME.LOAIKEHOACHGIANGDAY)
export class LoaiKeHoachGiangDayEntity extends CreateLoaiKeHoachGiangDayDto {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @ApiProperty()
  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @ApiProperty()
  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @ApiProperty()
  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
