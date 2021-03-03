import { ApiProperty } from '@nestjs/swagger';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  readonly page?: number;

  @ApiProperty({ required: false })
  readonly limit?: number;
}

export class FilterChuDe extends BaseFilterDto {
  @ApiProperty({ required: false, description: ' this field search by Ten ' })
  readonly search?: string;
}
