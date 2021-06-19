import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Column } from 'typeorm';

export class CreateLoaiKeHoachGiangDayDto {
  @ApiProperty()
  @Column({ length: 10, name: 'ma' })
  @IsString()
  @Matches(/^[a-zA-Z0-9]{2,}$/, { message: 'Ít nhất 2 ký tự bao gồm chữ hoặc số' })
  ma: string;

  @ApiProperty()
  @Column({ name: 'ten' })
  @IsString()
  @IsNotEmpty()
  // @Length(5)
  ten: string;
}
