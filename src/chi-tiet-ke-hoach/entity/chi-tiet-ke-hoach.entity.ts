import { TABLE_NAME } from 'constant/constant';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChiTietKeHoachDto } from 'chi-tiet-ke-hoach/dto/create-chi-tiet-ke-hoach.dto';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';

@Entity({ name: TABLE_NAME.CHITIETKEHOACH })
export class ChiTietKeHoachEntity extends CreateChiTietKeHoachDto {
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

  @OneToOne(() => ChiTietGomNhomEntity)
  @JoinColumn({ name: 'ID_ChiTietGomNhom' })
  chiTietGomNhom?: ChiTietGomNhomEntity;
}
