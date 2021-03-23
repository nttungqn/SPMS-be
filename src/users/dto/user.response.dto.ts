import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../entity/user.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllUserDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [UsersEntity] })
  readonly contents: UsersEntity[];
}
