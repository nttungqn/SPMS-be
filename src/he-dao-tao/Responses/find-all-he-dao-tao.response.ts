import { ApiProperty } from '@nestjs/swagger';
import { HeDaoTaoResponse } from './he-dao-tao.response';

export class FindAllHeDaoTaoResponse {
  @ApiProperty({ type: [HeDaoTaoResponse] })
  contents: HeDaoTaoResponse[];
}
