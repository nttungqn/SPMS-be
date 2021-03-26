import { ApiProperty } from '@nestjs/swagger';

export class UploadFile {
  @ApiProperty()
  readonly file?: string;
}
