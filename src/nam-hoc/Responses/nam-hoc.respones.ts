import { ApiProperty } from '@nestjs/swagger';

export class NamHocResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ma: string;
  @ApiProperty()
  ten: string;
  @ApiProperty()
  isDeleted: boolean;
}
