import { ApiProperty } from '@nestjs/swagger';
import { NamHocResponse } from './nam-hoc.respones';

export class FindAllNamHocResponse {
  @ApiProperty({ type: [NamHocResponse] })
  contents: NamHocResponse[];
}
