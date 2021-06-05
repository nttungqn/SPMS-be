import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ExportsDto {
  @IsNumberString()
  @ApiProperty({ description: 'id của syllabus' })
  readonly syllabusId: number;
}
