import { ApiProperty } from '@nestjs/swagger';

export class IntroPageInfo {
  @ApiProperty()
  totalStudent: number;
  @ApiProperty()
  totalTeacher: number;
  @ApiProperty()
  totalCTDDT: number;
  @ApiProperty()
  totalNganhDaoTao: number;
  @ApiProperty()
  toTalSyllabus: number;
}
