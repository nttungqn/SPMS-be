import { ApiProperty } from '@nestjs/swagger';
import { CreateChiTietGomNhomDTO } from 'chi-tiet-gom-nhom/dto/create-chi-tiet-gom-nhom.dto';
import { GomNhomEntity } from 'gom-nhom/entity/gom-nhom.entity';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { addListener } from 'process';
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, AfterLoad } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';

@Entity(TABLE_NAME.CHITIETGOMNHOM)
export class ChiTietGomNhomEntity extends CreateChiTietGomNhomDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @ManyToOne(() => GomNhomEntity, (gomNhom) => gomNhom.chiTietGomNhom)
  @JoinColumn({ name: 'ID_GomNhom' })
  gomNhom?: GomNhomEntity;

  @OneToOne(() => MonHocEntity, (monHoc) => monHoc.chiTietGomNhom, { eager: true })
  @JoinColumn({ name: 'ID_MonHoc' })
  monHoc?: MonHocEntity;

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
