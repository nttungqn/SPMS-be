import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.CHUANDAURA)
export class ChuanDauRaEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @IsString()
  @Column({ name: 'Ten' })
  ten: string;

  @ApiProperty()
  @IsInt()
  @Column({ name: 'MucDo' })
  mucDo: number;

  @Column()
  createdAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity)
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
