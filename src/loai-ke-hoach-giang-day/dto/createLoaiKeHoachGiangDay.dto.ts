import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Column } from 'typeorm';

export class CreateLoaiKeHoachGiangDayDto {
  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_|]{1,}$/, { message: 'Mã CTDT: Gồm chữ và số có >= 1 ký tự' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsString()
  @IsNotEmpty()
  // @Length(5)
  ten: string;
}
