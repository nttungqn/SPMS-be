import { ApiProperty } from '@nestjs/swagger';
import { RolesEntity } from '../entity/roles.entity';

export class BaseResponseDto {
  @ApiProperty()
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Số lượng kết quả tìm được' })
  readonly total?: number;
}

export class FindAllRolesDtoResponse extends BaseResponseDto {
  @ApiProperty({ type: [RolesEntity] })
  readonly contents: RolesEntity[];
}
