import { ApiProperty } from '@nestjs/swagger';

export class DeleteMutipleUsersDto {
  @ApiProperty({ required: true })
  readonly ids?: Array<number>;
}
