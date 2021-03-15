import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { TABLE_NAME } from 'constant/constant';
import { CreateMucTieuMonHocDto } from 'muc-tieu-mon-hoc/dto/create-muc-tieu-mon-hoc.dto';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity({ name: TABLE_NAME.MUCTIEUMONHOC })
export class MucTieuMonHocEntity extends CreateMucTieuMonHocDto {
  @PrimaryGeneratedColumn({ name: 'id' })
  id?: number;

  @ManyToMany(() => ChuanDauRaNganhDaoTaoEntity)
  @JoinTable({
    name: 'MucTieuMonHoc_ChuanDauRaCDIO',
    joinColumn: { name: 'idMTMH', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'idCDRCDIO', referencedColumnName: 'id' }
  })
  chuanDauRaCDIO?: ChuanDauRaNganhDaoTaoEntity[];

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
