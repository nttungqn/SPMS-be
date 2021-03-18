import { ApiProperty } from '@nestjs/swagger';

export class HeDaoTaoResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ma: string;
  @ApiProperty()
  ten: string;
  @ApiProperty()
  isDeleted: boolean;
}
