import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateNamHocDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{2,}$/, { message: 'Mã chỉ bao gồm chữ và số' })
  ma?: string;

  @ApiProperty()
  // @Length(5)
  @Matches(/^[0-9]{4}-[0-9]{4}$/, { message: 'Tên : yyyy-yyyy' })
  ten?: string;
}
