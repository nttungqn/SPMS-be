import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumberString } from 'class-validator';
import { MonHocEntity } from 'mon-hoc/entity/monHoc.entity';
import { typeCondition } from 'prerequisite-subject/enum/type-condition.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity('MonHoc_MonHocTienQuyet')
export class PrerequisiteSubject {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'idMH' })
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMH' })
  @IsInt()
  subject: number;

  @ApiProperty()
  @Column({ name: 'idMHTQ' })
  @ManyToOne(() => MonHocEntity)
  @JoinColumn({ name: 'idMHTQ' })
  @IsInt()
  preSubject: number;

  @ApiProperty()
  @Column({ name: 'LoaiDK' })
  @IsIn([1, 2])
  condition: typeCondition;

  @Column({ name: 'createdAt' })
  createdAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column({ name: 'isDeleted' })
  isDeleted: boolean;
}
