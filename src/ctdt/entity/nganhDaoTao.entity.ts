import { ApiProperty } from '@nestjs/swagger';
import { ChuongTrinhDaoTaoEntity } from 'chuong-trinh-dao-tao/entity/chuongTrinhDaoTao.entity';
import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';
import { TABLE_NAME } from 'constant/constant';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Entity(TABLE_NAME.NGANHDAOTAO)
export class NganhDaoTaoEntity {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  @Length(5)
  @IsNotEmpty()
  maNganhDaoTao: string;

  @IsString()
  @ApiProperty()
  @Column()
  @Length(5)
  @IsNotEmpty()
  ten: string;

  @ApiProperty()
  @IsInt()
  @OneToOne(() => ChuongTrinhDaoTaoEntity)
  @JoinColumn({ name: 'ctdtID' })
  @IsNotEmpty()
  @Min(1)
  chuongTrinhDaoTao: number;

  @Column()
  createdAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdBy' })
  createdBy: number;

  @Column()
  updatedAt: Date;

  @OneToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: number;

  @Column()
  isDeleted: boolean;
}
