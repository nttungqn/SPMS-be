import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';
import { CreateSyllabusDto } from 'syllabus/dto/create-syllabus.dto';

@Entity(TABLE_NAME.SYLLABUS)
export class Syllabus extends CreateSyllabusDto {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'createdBy' })
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: number;

  @Column({ name: 'updatedBy' })
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: number;

  @Column({ name: 'updatedAt' })
  updatedAt?: Date;

  @Column({ name: 'createdAt' })
  createdAt?: Date;

  @Column({ name: 'isDeleted' })
  isDeleted?: boolean;
}
