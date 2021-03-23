import { ApiProperty } from '@nestjs/swagger';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateUserDto } from './../dto/update-user.dto';

@Entity(TABLE_NAME.USERS)
export class UsersEntity extends UpdateUserDto {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @Column({ name: 'password' })
  password: string;

  @ApiProperty()
  @Column({ default: new Date() })
  createdAt: Date;

  @ApiProperty()
  @Column()
  updatedAt: Date;

  @ApiProperty()
  @Column({ default: false })
  isDeleted: boolean;

  @ApiProperty()
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty()
  @Column({ name: 'tokenVerifyEmail' })
  tokenVerifyEmail: string;
}
