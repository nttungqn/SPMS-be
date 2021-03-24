import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany, AfterLoad } from 'typeorm';
import { CreateGomNhomDTO } from 'gom-nhom/dto/create-gom-nhom';
import { UsersEntity } from 'users/entity/user.entity';
import { TABLE_NAME } from '../../constant/constant';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';

@Entity(TABLE_NAME.GOMNHOM, { orderBy: { stt: 'ASC' } })
export class GomNhomEntity extends CreateGomNhomDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ManyToOne(() => LoaiKhoiKienThucEntity)
  @JoinColumn({ name: 'ID_LoaiKhoiKienThuc' })
  loaiKhoiKienThuc?: LoaiKhoiKienThucEntity;

  @OneToMany(() => ChiTietGomNhomEntity, (chiTietGomNhom) => chiTietGomNhom.gomNhom, { eager: true })
  chiTietGomNhom?: ChiTietGomNhomEntity[];

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @ApiProperty()
  @ManyToOne(() => UsersEntity)
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

  @AfterLoad()
  afterLoad() {
    this.chiTietGomNhom = this.chiTietGomNhom.filter((ctgn) => ctgn.isDeleted === false);
  }
}
