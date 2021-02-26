import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MonHoc')
export class MonHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  ID: number;

  // @ApiProperty()
  // @Column({name: 'idKKT'})
  // IDKTT: number;

  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  Ma: string;

  @ApiProperty()
  @Column({ name: 'tenTiengViet' })
  TenTiengViet: string;

  @ApiProperty()
  @Column({ name: 'tenTiengAnh' })
  TenTiengAnh: string;

  @ApiProperty()
  @Column({ name: 'soTinChi' })
  SoTinChi: number;

  @ApiProperty()
  @Column({ name: 'soTietLyThuyet' })
  SoTietLyThuyet: number;

  @ApiProperty()
  @Column({ name: 'soTietThucHanh' })
  SoTietThucHanh: number;

  @ApiProperty()
  @Column({ name: 'soTietTuHoc' })
  SoTietTuHoc: number;

  @ApiProperty()
  @Column({ name: 'moTa' })
  MoTa: string;

  // @Column({default: Date.now()})
  // createdAt: Date;

  // @Column()
  // updatedAt: Date;

  // // @OneToOne(() => User)
  // // @JoinColumn()
  // // createdBy: User;

  // // @OneToOne(() => User)
  // // @JoinColumn()
  // // updatedBy: User;

  // @Column({default: false})
  // isDeleted: Boolean
}
