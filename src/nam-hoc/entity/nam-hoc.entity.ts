import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NamHoc')
export class NamHocEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ name: 'ma' })
  ma: string;
  @Column({ name: 'ten' })
  ten: string;
  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
