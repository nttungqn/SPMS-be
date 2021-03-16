import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { MonHocEntity } from 'mon-hoc/entity/mon-hoc.entity';
import { NamHocEntity } from 'nam-hoc/entity/nam-hoc.entity';
import { HeDaoTaoEntity } from 'he-dao-tao/entity/type-of-education.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateSyllabusDto } from 'syllabus/dto/create-syllabus.dto';

@Entity(TABLE_NAME.SYLLABUS)
export class Syllabus extends CreateSyllabusDto {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'createdBy' })
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedBy' })
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
