import { PartialType } from '@nestjs/mapped-types';
import { CreateSoKhopDto } from './create-so-khop.dto';

export class UpdateSoKhopDto extends PartialType(CreateSoKhopDto) {}
